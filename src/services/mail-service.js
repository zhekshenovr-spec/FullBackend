import nodemailer from 'nodemailer'

class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:Number(process.env.SMTP_PORT),
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: "Account activation on " + process.env.API_URL,
                text: "",
                html: `
                <div>
                    <h1>To activate, follow the link</h1>
                    <a href=${link}>${link}</a>
                </div>
                `,
            })
        } catch (e) {
            console.error("Error sending activation email:", e.message)
            throw new Error("Failed to send activation email")
        }
    }
    async sendOtpCode(to, code){
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:"Your authorization code "+ process.env.API_URL,
            text:"",
            html:`
            <div>
                <h1>Your code</h1>
                <p>${code}</p>
            </div>
            `
        })
    }

}
export default MailService