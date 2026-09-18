(function () {
  const S = window.SITE || {};
  const ROOT = document.documentElement.getAttribute("data-root") || "";
  const toggle = document.querySelector("[data-menu]");
  const links = document.querySelector("[data-nav]");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const text = el.getAttribute("data-wa") || defaultMsg();
      const url = waUrl(text);
      if (!url) {
        e.preventDefault();
        alert("WhatsApp is not configured.");
        return;
      }
      el.setAttribute("href", url);
    });
  });
  document.querySelectorAll("form[data-lead]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.querySelector("[name=company_website]")?.value) return;
      const data = Object.fromEntries(new FormData(form).entries());
      const contact = (data.email || data.phone || data.whatsapp || "").trim();
      if (!contact) {
        alert("Please leave an email, phone, or WhatsApp number so we can reply.");
        return;
      }
      const payload = { ...data, page: location.pathname, title: document.title, at: new Date().toISOString() };
      const msg = compose(payload);
      sessionStorage.setItem("lastLead", JSON.stringify(payload));
      const inbox = S.email || "mail4diego@gmail.com";
      const endpoint = S.formEndpoint || ("https://formsubmit.co/ajax/" + inbox);
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...payload, _subject: "Puerto Vallarta buyer inquiry", _template: "table" })
        });
      } catch (err) {
        window.location.href = "mailto:" + inbox + "?subject=" + encodeURIComponent("Puerto Vallarta buyer inquiry") + "&body=" + encodeURIComponent(msg);
        return;
      }
      location.href = ROOT + "thank-you/";
    });
  });
  function defaultMsg() {
    return "Hi, I was reading " + document.title + " and I would like help with Puerto Vallarta real estate. " + location.href;
  }
  function compose(d) {
    return ["New Puerto Vallarta buyer inquiry","Name: "+(d.name||"—"),"Email: "+(d.email||"—"),"Phone: "+(d.phone||"—"),"WhatsApp: "+(d.whatsapp||"—"),"Looking for: "+(d.looking_for||"—"),"Location: "+(d.location||"—"),"Type: "+(d.property_type||"—"),"Budget: "+(d.budget||"—"),"Timeline: "+(d.timeline||"—"),"Message: "+(d.message||"—"),"Page: "+location.href].join("\n");
  }
  function waUrl(text) {
    if (!S.whatsapp) return "";
    return "https://wa.me/" + String(S.whatsapp).replace(/[^\d]/g, "") + "?text=" + encodeURIComponent(text);
  }
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
