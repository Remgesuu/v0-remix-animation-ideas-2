import { NextRequest, NextResponse } from "next/server";

const experienceLabels: Record<string, string> = {
  "beginner": "Нет опыта в программировании",
  "other-lang": "Есть опыт в другом языке",
  "junior-go": "Junior Go-разработчик",
  "middle": "Middle+ разработчик",
};

export async function POST(request: NextRequest) {
  console.log("[v0] API Lead: POST request received");
  
  try {
    // Check environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log("[v0] API Lead: botToken exists:", !!botToken, "chatId:", chatId);

    if (!botToken || !chatId) {
      console.error("[v0] API Lead: Missing Telegram environment variables");
      return NextResponse.json(
        { error: "Сервер временно недоступен. Попробуйте позже или напишите напрямую в Telegram." },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, contact, experience } = body;

    // Server-side validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.name = "Имя обязательно для заполнения";
    } else if (name.trim().length > 100) {
      errors.name = "Имя слишком длинное";
    }

    if (!contact || typeof contact !== "string" || contact.trim().length === 0) {
      errors.contact = "Контакт обязателен для заполнения";
    } else if (contact.trim().length > 100) {
      errors.contact = "Контакт слишком длинный";
    }

    if (!experience || typeof experience !== "string" || experience.trim().length === 0) {
      errors.experience = "Выберите уровень опыта";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Проверьте заполнение формы", errors },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedContact = contact.trim().slice(0, 100);
    const sanitizedExperience = experience.trim();
    const experienceLabel = experienceLabels[sanitizedExperience] || sanitizedExperience;

    // Format message for Telegram
    const timestamp = new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `🚀 *Новая заявка с сайта ZaharGo*

👤 *Имя:* ${escapeMarkdown(sanitizedName)}
📱 *Контакт:* ${escapeMarkdown(sanitizedContact)}
📊 *Уровень:* ${escapeMarkdown(experienceLabel)}
🕐 *Время:* ${timestamp}
🌐 *Источник:* Landing Form`;

    // Send to Telegram
    // Parse chatId as number (required for negative group IDs)
    const numericChatId = parseInt(chatId, 10);
    console.log("[v0] API Lead: Sending to Telegram, chatId:", chatId, "numericChatId:", numericChatId);
    
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: numericChatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    console.log("[v0] API Lead: Telegram response status:", telegramResponse.status);

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error("[v0] API Lead: Telegram API error:", JSON.stringify(errorData));
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Попробуйте позже или напишите напрямую в Telegram." },
        { status: 500 }
      );
    }

    console.log("[v0] API Lead: Success!");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Lead] Unexpected error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже или напишите напрямую в Telegram." },
      { status: 500 }
    );
  }
}

// Escape special characters for Telegram Markdown
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
