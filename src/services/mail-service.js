import nodemailer from 'nodemailer'

class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from:process.env.SMTP_USER,
            to,
            subject:"Активация аккаунта на "+ process.env.API_URL,
            text:"",
            html:`
            <div>
                <h1>для активации переите оп ссылке</h1>
                <a href=${link}>${link}</a>
            </div>
            `
        })
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