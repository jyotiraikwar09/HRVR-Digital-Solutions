from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'yourgmail@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_app_password'

mail = Mail(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/send_mail", methods=["POST"])
def send_mail():
    name = request.form.get("name")
    email = request.form.get("email")
    project = request.form.get("project")
    message = request.form.get("message")

    msg = Message(
        subject=f"New Project Inquiry from {name}",
        sender=email,
        recipients=["yourgmail@gmail.com"]
    )

    msg.body = f"""
    Name: {name}
    Email: {email}
    Project Type: {project}

    Message:
    {message}
    """

    mail.send(msg)

    return jsonify({"message": "Message Sent Successfully ✅"})