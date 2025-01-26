"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSender = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var path_1 = __importDefault(require("path"));
var ExcelJS = require('exceljs');
var EmailSender = /** @class */ (function () {
    function EmailSender(config) {
        this.config = config;
        this.failedFilePath = '';
        this.failedFileName = 'failed_emails-' + new Date().toISOString() + '.xlsx';
        this.transporter = nodemailer_1.default.createTransport({
            service: this.config.service,
            auth: {
                user: this.config.user,
                pass: this.config.pass,
            },
        });
    }
    EmailSender.prototype.prepareMessage = function (message, contact) {
        return message.replace('${name}', contact.name || '');
    };
    EmailSender.prototype.sendEmails = function (contacts, message, subject) {
        return __awaiter(this, void 0, void 0, function () {
            var fails, _loop_1, this_1, _i, contacts_1, contact;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (contacts.length === 0) {
                            throw new Error("Contacts can't be empty");
                        }
                        if (!message || !subject) {
                            throw new Error("Message and Subject can't be empty");
                        }
                        fails = [];
                        _loop_1 = function (contact) {
                            var htmlContent, mailOptions, sendEmail, result;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        htmlContent = this_1.prepareMessage(message, contact);
                                        mailOptions = {
                                            from: this_1.config.name
                                                ? "".concat(this_1.config.name, " <").concat(this_1.config.user, ">")
                                                : this_1.config.user,
                                            to: contact.email,
                                            subject: subject,
                                            html: htmlContent,
                                            attachments: [],
                                        };
                                        sendEmail = function () { return __awaiter(_this, void 0, void 0, function () {
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                return [2 /*return*/, new Promise(function (resolve) {
                                                        _this.transporter.sendMail(mailOptions, function (error, info) {
                                                            if (error) {
                                                                resolve({ success: false, contact: contact });
                                                            }
                                                            else {
                                                                resolve({ success: true, contact: contact });
                                                            }
                                                        });
                                                    })];
                                            });
                                        }); };
                                        return [4 /*yield*/, sendEmail()];
                                    case 1:
                                        result = _b.sent();
                                        if (!result.success) {
                                            fails.push(result.contact);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, contacts_1 = contacts;
                        _a.label = 1;
                    case 1:
                        if (!(_i < contacts_1.length)) return [3 /*break*/, 4];
                        contact = contacts_1[_i];
                        return [5 /*yield**/, _loop_1(contact)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (fails.length > 0) {
                            this.createFailedEmailsExcel(fails);
                            throw new Error("Failed to send emails to: ".concat(fails.map(function (c) { return c.email; }).join(', ')));
                        }
                        return [2 /*return*/, "All emails sent successfully"];
                }
            });
        });
    };
    EmailSender.prototype.createFailedEmailsExcel = function (failedEmails) {
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.columns = [
            { header: 'EmailAddress', key: 'email' },
            { header: 'FirstName', key: 'firstName' },
        ];
        failedEmails.forEach(function (contact) {
            worksheet.addRow({ email: contact.email, firstName: contact.name });
        });
        var filePath = path_1.default.join(__dirname, this.failedFilePath +
            (this.failedFilePath ? '/' : '') +
            this.failedFileName);
        workbook.xlsx.writeFile(filePath).then(function () {
            console.log('File saved successfully.');
        });
    };
    return EmailSender;
}());
exports.EmailSender = EmailSender;
var emailConfig = {
    name: 'Yadab',
    service: 'yahoo',
    user: 'yadab.sutradhar@yahoo.com',
    pass: 'dpbuybruyhuaigxu',
};
var emailSender = new EmailSender(emailConfig);
var contacts = [{ email: 'yadab.sd2013@gmail.com', name: 'Yadab' }];
var message = 'Hello ${name}, this is a test email!';
var subject = 'Test Email';
emailSender
    .sendEmails(contacts, message, subject)
    .then(function (message) {
    console.log(message);
})
    .catch(function (error) {
    console.error(error);
});
