export interface ParsedCeremonyDate {
  dayOfWeek: string;
  dateFormatted: string;
  fullDateFormatted: string;
  monthShort: string;
  dayNumber: string;
  year: string;
  isoDate: string;
  timestamp: number;
}

export function parseCeremonyDate(dateStr: string, timeStr?: string): ParsedCeremonyDate {
  if (!dateStr || typeof dateStr !== "string") {
    return {
      dayOfWeek: "",
      dateFormatted: "",
      fullDateFormatted: "",
      monthShort: "",
      dayNumber: "",
      year: "2026",
      isoDate: "",
      timestamp: 0,
    };
  }

  // Remove extra whitespace around hyphens/slashes e.g. "10 -11-2026" -> "10-11-2026"
  const clean = dateStr.trim().replace(/\s*([-/])\s*/g, "$1");
  let year: number | null = null;
  let month: number | null = null; // 0-indexed
  let day: number | null = null;

  // 1. Format: YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(clean)) {
    const parts = clean.split(/[-/T ]/);
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }
  // 2. Format: DD-MM-YYYY or DD/MM/YYYY
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(clean)) {
    const parts = clean.split(/[-/T ]/);
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  }
  // 3. Format: Textual dates e.g. "Nov 10, 2026", "November 10, 2026", "10 Nov 2026"
  else {
    const parsed = new Date(clean.includes("2026") ? clean : `${clean}, 2026`);
    if (!isNaN(parsed.getTime())) {
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    }
  }

  if (year !== null && month !== null && day !== null && !isNaN(year) && !isNaN(month) && !isNaN(day)) {
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "long" });
      const dateFormatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const fullDateFormatted = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      const monthShort = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      const dayNumber = String(day).padStart(2, "0");
      const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      // Calculate sortable timestamp with optional time
      let hours = 12;
      let minutes = 0;
      if (timeStr) {
        const lower = timeStr.toLowerCase();
        if (lower.includes("barat") && lower.includes("10")) {
          hours = 10;
          minutes = 0;
        } else if (lower.includes("10:30") || lower.includes("10.30")) {
          hours = 10;
          minutes = 30;
        } else if (lower.includes("12:30") || lower.includes("12.30")) {
          hours = 12;
          minutes = 30;
        } else if (lower.includes("8:00") || lower.includes("8 pm") || lower.includes("8:00 pm")) {
          hours = 20;
          minutes = 0;
        } else {
          const timeMatch = timeStr.match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
          if (timeMatch) {
            hours = parseInt(timeMatch[1], 10);
            minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
            const meridian = timeMatch[3]?.toUpperCase();
            if (meridian === "PM" && hours < 12) hours += 12;
            if (meridian === "AM" && hours === 12) hours = 0;
          }
        }
      }
      const timestamp = new Date(year, month, day, hours, minutes).getTime();

      return {
        dayOfWeek,
        dateFormatted,
        fullDateFormatted,
        monthShort,
        dayNumber,
        year: String(year),
        isoDate,
        timestamp,
      };
    }
  }

  return {
    dayOfWeek: "",
    dateFormatted: clean,
    fullDateFormatted: clean,
    monthShort: "",
    dayNumber: "",
    year: "2026",
    isoDate: clean,
    timestamp: 0,
  };
}

export function formatAuspiciousTime(timeStr: string): string {
  if (!timeStr) return "";
  const clean = timeStr.trim();
  const lower = clean.toLowerCase();

  // Combined Haldi & Sagan/Ring 2 timings
  if ((lower.includes("haldi") && (lower.includes("sagan") || lower.includes("ring"))) ||
      (lower.includes("12:30") && (lower.includes("8:00") || lower.includes("8 pm")))) {
    return "Haldi: 12:30 PM • Sagan & Ring: 8:00 PM";
  }
  // Kirtan Darbar timing
  if (lower.includes("10:30") && lower.includes("1:30")) {
    return "10:30 AM – 1:30 PM";
  }
  // Barat & Anand Karaj timing
  if (lower.includes("barat") || (lower.includes("anand") && lower.includes("karaj") && lower.includes("10"))) {
    return "Barat: 10:00 AM • Anand Karaj: 12:00 PM";
  }
  // Haldi timing
  if (lower.includes("12:30")) {
    return "12:30 PM";
  }
  // Ring / Sagan timing
  if (lower.includes("8:00") || lower.includes("8 pm") || lower.includes("8:00 pm") || lower.includes("sagan") || lower.includes("ring")) {
    return "8:00 PM";
  }
  // 12:00 PM Anand Karaj
  if (lower.includes("12:00") || lower.includes("12 pm")) {
    return "Barat: 10:00 AM • Anand Karaj: 12:00 PM";
  }

  return clean;
}

export function sortWeddingEvents<T extends { date: string; time: string; title?: string }>(events: T[]): T[] {
  if (!events || !Array.isArray(events)) return [];
  return [...events].sort((a, b) => {
    const timeA = parseCeremonyDate(a.date, a.time).timestamp;
    const timeB = parseCeremonyDate(b.date, b.time).timestamp;
    if (timeA && timeB && timeA !== timeB) return timeA - timeB;
    return (a.date || "").localeCompare(b.date || "");
  });
}

export function generateIcsFile(weddingData: any) {
  const startDate = new Date(weddingData.weddingDate);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
BEGIN:VEVENT
UID:${startDate.getTime()}@wedding.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Wedding of ${weddingData.bride.name} & ${weddingData.groom.name}
LOCATION:${weddingData.venue.name}, ${weddingData.venue.addressLine1}
DESCRIPTION:Join us to celebrate the wedding of ${weddingData.bride.name} & ${weddingData.groom.name}.
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "wedding-invitation.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
