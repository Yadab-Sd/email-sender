interface EmailConfig {
    service: string;
    name?: string;
    user: string;
    pass: string;
}
interface Contact {
    email: string;
    name?: string;
}
export declare class EmailSender {
    private config;
    private transporter;
    private failedFilePath;
    private failedFileName;
    constructor(config: EmailConfig);
    private prepareMessage;
    sendEmails(contacts: Contact[], message: string, subject: string): Promise<string>;
    private createFailedEmailsExcel;
}
export {};
