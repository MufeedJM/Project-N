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
    return [
      {
        id: 'inq-sample-1',
        name: 'Kamal Jayawardena',
        email: 'kamal.agri@gmail.com',
        phone: '077 894 1234',
        varietyInterest: 'Tomato Seeds (T-245)',
        message: 'Can this T-245 tomato variety tolerate high bacterial wilt conditions during the heavy Maha rains in Anuradhapura?',
        submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'inq-sample-2',
        name: 'Sanjeewa Perera',
        email: 'sanjeewa.p@yahoo.com',
        phone: '071 456 7890',
        varietyInterest: 'Papaya Seeds (Red Lady 786)',
        message: 'Do you supply bulk orders of 1,000 seeds for commercial cultivation in Polonnaruwa?',
        submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      }
    ];
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
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please provide a valid email address.');
    }

    if (!data.name.trim()) {
      throw new Error('Please enter your name.');
    }

    if (!data.message.trim() || data.message.length < 10) {
      throw new Error('Please enter a detailed question (at least 10 characters).');
    }

    // Simulate network request to backend / email notification service
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newInquiry: QuestionInquiry = {
      id: `inq-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || undefined,
      varietyInterest: data.varietyInterest?.trim() || undefined,
      message: data.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    const current = this.getStoredInquiries();
    this.saveInquiries([newInquiry, ...current]);

    return {
      success: true,
      message: 'Thank you! Your agricultural inquiry has been received. Our agronomist team will respond within 24 hours.',
      inquiry: newInquiry,
    };
  }
}

export const inquiryService = new InquiryService();
