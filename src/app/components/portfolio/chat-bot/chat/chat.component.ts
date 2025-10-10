import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ResponseStatus} from "../../../../model/api-responses";
import {environment} from "../../../../../environments/environment";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ChatServiceService} from "../../../../services/chat/chat-service.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinner
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked, OnChanges {
  @Input() isOpen = false;
  @Input() sessionId: string | null = null;
  @Input() disableInputs = false;
  @Input() isViewingAsAdmin = false;
  @Output() close = new EventEmitter<boolean>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  userName = environment.username;
  transformOrigin = 'bottom right';
  currentMessage = '';
  messages: Array<{ content: string; isUser: boolean }> = [];
  isMobile = window.innerWidth < 600;
  isTyping = false;
  isLoadingHistory = false;
  historyAllLoaded = false;
  protected historyCurrentPage = 0;
  private historyTotalPages = 0;
  private shouldScrollToBottom = false;

  constructor(private chatService: ChatServiceService) {
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When the chat is opened, or the session ID changes, reset and load.
    if ((changes['isOpen'] && this.isOpen) || (changes['sessionId'] && this.sessionId)) {
      this.resetChatState();
      this.loadChatHistory(0);
    }
    // When the chat is closed, reset its state.
    if (changes['isOpen'] && !this.isOpen) {
      this.resetChatState();
    }
  }

  private resetChatState(): void {
    this.messages = [];
    this.historyCurrentPage = 0;
    this.historyTotalPages = 0;
    this.historyAllLoaded = false;
    this.isTyping = false;
    this.isLoadingHistory = false;
  }

  loadChatHistory(page: number): void {
    this.isLoadingHistory = true;

    this.chatService.getChatHistoryForSessionId(page).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.SUCCESS && response.detail) {
          const history = response.detail.object || [];
          // The service returns latest first, so we reverse to get chronological order for processing
          const newMessages = history.reverse().flatMap(item => [
            { content: item.visitorQuestion, isUser: !this.isViewingAsAdmin },
            { content: item.aiResponse, isUser: this.isViewingAsAdmin }
          ]);

          this.messages.unshift(...newMessages);

          this.historyCurrentPage = response.detail.currentPage;
          this.historyTotalPages = response.detail.lastpage;
          if (this.historyCurrentPage >= this.historyTotalPages) {
            this.historyAllLoaded = true;
          }
        }
        if (page === 0) this.shouldScrollToBottom = true;
      },
      error: () => {},
      complete: () => {
        this.isTyping = false;
        this.isLoadingHistory = false;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.isTyping) return;
    console.log("Sending message:", this.currentMessage);

    this.messages.push({
      content: this.currentMessage,
      isUser: true
    });

    const userMessage = this.currentMessage;
    this.currentMessage = '';

    this.isTyping = true;
    this.shouldScrollToBottom = true;

    this.chatService.getMessageResponse(userMessage).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.messages.push({
          content: response,
          isUser: false
        });
        this.shouldScrollToBottom = true;
        // Auto-focus the input field after response
        setTimeout(() => {
          this.focusInput();
        }, 100);
      },
      error: (error) => {
        this.isTyping = false;
        this.messages.push({
          content: error.message,
          isUser: false
        });
        this.shouldScrollToBottom = true;
        // Auto-focus the input field after response
        setTimeout(() => {
          this.focusInput();
        }, 100);
      }
    });
    this.currentMessage = '';
  }

  private focusInput(): void {
    try {
      if (this.messageInput && this.messageInput.nativeElement) {
        this.messageInput.nativeElement.focus();
      }
    } catch (err) {
      console.error('Error focusing input:', err);
    }
  }

  closeChat() {
    this.isOpen = !this.isOpen;
    this.close.emit(this.isOpen);
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
