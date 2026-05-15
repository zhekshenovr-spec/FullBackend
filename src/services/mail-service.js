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
                subject: "Активация аккаунта на " + process.env.API_URL,
                text: "",
                html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
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
            subject:"Ваш код для авторизации "+ process.env.API_URL,
            text:"",
            html:`
            <div>
                <h1>Ваш код</h1>
                <p>${code}</p>
            </div>
            `
        })
    }

}
export default MailService