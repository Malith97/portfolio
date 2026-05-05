import {
  getPreferredLanguage,
  LANGUAGE_CHANGE_EVENT,
  notifyLanguageChange,
  persistLanguagePreference,
} from "@/lib/i18n-client";
import { LANGUAGE_COOKIE_KEY, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";

describe("i18n client helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = `${LANGUAGE_COOKIE_KEY}=; Max-Age=0; Path=/`;
  });

  it("uses localStorage preference first", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "fi");
    document.cookie = `${LANGUAGE_COOKIE_KEY}=eng; Path=/`;

    expect(getPreferredLanguage("eng")).toBe("fi");
  });

  it("falls back to cookie preference", () => {
    document.cookie = `${LANGUAGE_COOKIE_KEY}=fi; Path=/`;

    expect(getPreferredLanguage("eng")).toBe("fi");
  });

  it("uses fallback when no persisted preference exists", () => {
    expect(getPreferredLanguage("eng")).toBe("eng");
    expect(getPreferredLanguage("fi")).toBe("fi");
  });

  it("persists preference to localStorage and cookie", () => {
    persistLanguagePreference("fi");

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("fi");
    expect(document.cookie).toContain(`${LANGUAGE_COOKIE_KEY}=fi`);
  });

  it("dispatches language change events", () => {
    const listener = vi.fn();
    window.addEventListener(LANGUAGE_CHANGE_EVENT, listener as EventListener);

    notifyLanguageChange("fi");

    expect(listener).toHaveBeenCalledTimes(1);
    const [event] = listener.mock.calls[0];
    expect((event as CustomEvent<{ language: string }>).detail.language).toBe(
      "fi",
    );

    window.removeEventListener(
      LANGUAGE_CHANGE_EVENT,
      listener as EventListener,
    );
  });
});
