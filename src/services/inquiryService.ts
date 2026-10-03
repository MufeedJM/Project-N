import { QuestionInquiry } from '../types';

const INQUIRIES_STORAGE_KEY = 'ceylon_seeds_inquiries';

class InquiryService {
  private getStoredInquiries(): QuestionInquiry[] {
    try {
      const stored = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading inquiries from localStorage', e);
    }
    return [];
  }

  private saveInquiries(inquiries: QuestionInquiry[]): void {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Error saving inquiries to localStorage', e);
    }
  }

  public getAll(): QuestionInquiry[] {
    return this.getStoredInquiries();
  }

  public async submitInquiry(data: Omit<QuestionInquiry, 'id' | 'submittedAt'>): Promise<{ success: boolean; message: string; inquiry: QuestionInquiry }> {
    if (!data.message.trim() || data.message.length < 10) {
      throw new Error('Please enter a detailed question (at least 10 characters).');
    }

    // Simulate network request to backend / email notification service
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newInquiry: QuestionInquiry = {
      id: `inq-${Date.now()}`,
      phone: data.phone?.trim() || undefined,
      varietyInterest: data.varietyInterest?.trim() || undefined,
      message: data.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    const current = this.getStoredInquiries();
    this.saveInquiries([newInquiry, ...current]);

    return {
      success: true,
      message: 'Thank you! Your agricultural question has been received.',
      inquiry: newInquiry,
    };
  }
}

export const inquiryService = new InquiryService();
