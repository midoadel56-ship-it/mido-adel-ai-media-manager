
import os
import logging
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
)

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN")
OWNER_ID = os.getenv("OWNER_ID")
CHANNEL_ID = os.getenv("CHANNEL_ID", "@medopho")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user

    await update.message.reply_text(
        "أهلاً بيك في Mido Adel AI Media Manager 🚀\n\n"
        "البوت بدأ التشغيل بنجاح.\n"
        "استخدم /help لمعرفة الأوامر المتاحة."
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = (
        "🤖 Mido Adel AI Media Manager\n\n"
        "/start - تشغيل البوت\n"
        "/help - المساعدة\n"
        "/status - حالة البوت\n"
        "/testchannel - اختبار النشر في القناة\n\n"
        "المزيد من الوظائف سيتم إضافتها تدريجيًا."
    )
    await update.message.reply_text(message)


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🟢 البوت يعمل حاليًا ويتصل بخادم Telegram."
    )


async def test_channel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)

    if not OWNER_ID or user_id != OWNER_ID:
        await update.message.reply_text("غير مصرح لك باستخدام الأمر.")
        return

    try:
        await context.bot.send_message(
            chat_id=CHANNEL_ID,
            text="🚀 اختبار اتصال Mido Adel AI Media Manager ناجح!"
        )
        await update.message.reply_text("تم إرسال رسالة الاختبار للقناة بنجاح.")
    except Exception:
        logger.exception("Channel test failed")
        await update.message.reply_text(
            "تعذر النشر. راجع صلاحيات البوت ومعرف القناة وإعدادات الخادم."
        )


def main():
    if not BOT_TOKEN:
        raise RuntimeError("BOT_TOKEN environment variable is missing.")

    if not OWNER_ID:
        raise RuntimeError("OWNER_ID environment variable is missing.")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(CommandHandler("testchannel", test_channel))

    logger.info("Mido Adel AI Media Manager is starting...")
    app.run_polling()


if __name__ == "__main__":
    main()
