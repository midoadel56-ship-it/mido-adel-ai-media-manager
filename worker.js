export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" && request.method === "GET") {
      return new Response("Mido Adel AI Media Manager is running 🤖");
    }

    // Configure Telegram webhook
    if (url.pathname === "/setup" && request.method === "GET") {
      if (!env.BOT_TOKEN || !env.WEBHOOK_SECRET) {
        return new Response("Missing required secrets", { status: 500 });
      }

      if (url.searchParams.get("key") !== env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: `${url.origin}/telegram/webhook`,
            secret_token: env.WEBHOOK_SECRET,
            allowed_updates: ["message"]
          })
        }
      );

      return new Response(await telegramResponse.text(), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Telegram webhook
    if (url.pathname === "/telegram/webhook" && request.method === "POST") {
      if (
        request.headers.get("X-Telegram-Bot-Api-Secret-Token") !==
        env.WEBHOOK_SECRET
      ) {
        return new Response("Unauthorized", { status: 401 });
      }

      let update;

      try {
        update = await request.json();
      } catch {
        return new Response("Invalid JSON", { status: 400 });
      }

      const message = update.message;

      if (!message || !message.text) {
        return new Response("OK");
      }

      const chatId = message.chat.id;
      const userId = String(message.from?.id || "");
      const command = message.text.trim().split(/\s+/)[0].split("@")[0];

      async function sendMessage(target, text) {
        const response = await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: target,
              text
            })
          }
        );

        return response.json();
      }

      if (command === "/start") {
        await sendMessage(
          chatId,
          "أهلاً بيك في Mido Adel AI Media Manager 🤖\n\nأنا مساعدك لإدارة محتوى السوشيال ميديا.\n\nاكتب /help لعرض الأوامر."
        );

      } else if (command === "/help") {
        await sendMessage(
          chatId,
          "الأوامر المتاحة:\n/start - تشغيل البوت\n/help - المساعدة\n/status - حالة البوت\n/testchannel - اختبار النشر في القناة"
        );

      } else if (command === "/status") {
        await sendMessage(
          chatId,
          "البوت شغال ومتصل بتيليجرام بنجاح ✅"
        );

      } else if (command === "/testchannel") {
        if (userId !== String(env.OWNER_ID)) {
          await sendMessage(chatId, "الأمر متاح لمالك البوت فقط.");
        } else {
          const result = await sendMessage(
            env.CHANNEL_ID,
            "تم ربط Mido Adel AI Media Manager بالقناة بنجاح ✅"
          );

          await sendMessage(
            chatId,
            result.ok
              ? "تم النشر في القناة بنجاح ✅"
              : "فشل النشر. تأكد من صلاحيات البوت في القناة."
          );
        }

      } else {
        await sendMessage(chatId, "الأمر غير معروف. اكتب /help");
      }

      return new Response("OK");
    }

    return new Response("Not found", { status: 404 });
  }
};



