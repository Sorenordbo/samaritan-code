"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TextButton, IconButton, Tag, Banner, SystemIcons, Size, LoadingIndicator } from "@laerdal/life-react-components";
import { ThemeProvider } from "styled-components";

/* ── Types ── */
interface Project { id: string; name: string; path: string; previewUrl: string | null; mobile?: boolean; }
interface AttachedFile { name: string; type: "image" | "text" | "other"; dataUrl?: string; text?: string; mediaType?: string; }
interface AnyMessage { role: "user" | "assistant"; content: string | any[]; }
interface Chat { id: string; title: string; projectId: string | null; messages: AnyMessage[]; createdAt: string; }

/* ── Helpers ── */
function humanName(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTextContent(c: string | any[]): string {
  if (typeof c === "string") return c;
  return (c as any[]).filter((b) => b.type === "text").map((b) => b.text).join("");
}
function isDisplayMessage(m: AnyMessage) { return getTextContent(m.content).length > 0; }

/* ── Samaritan heart icon (official SVG) ── */
function SamaritanIcon({ size = 20, dark = false }: { size?: number; dark?: boolean }) {
  if (dark) return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <path d="M11.4905 12.5553C12.3382 13.3791 13.6934 13.3717 14.532 12.5331L15.298 11.767C16.5672 10.4978 18.6251 10.4979 19.8943 11.7671C20.4829 12.3557 20.7985 13.1139 20.8412 13.8844L21.8095 12.9161C23.7133 11.0123 23.7133 7.92564 21.8095 6.02183C19.9057 4.11803 16.819 4.11803 14.9152 6.02183L11.443 9.49422C10.6292 10.3346 10.63 11.6712 11.4456 12.5105L11.4905 12.5553Z" fill="#8969A5"/>
      <path d="M19.1136 12.5187L19.1426 12.5477C19.9736 13.3942 19.9695 14.7535 19.1305 15.595L19.1282 15.5973L13.5453 21.1801C13.2441 21.4813 12.7558 21.4813 12.4546 21.1801L4.19057 12.9161C2.28677 11.0123 2.28677 7.92564 4.19057 6.02183C6.09438 4.11803 9.18106 4.11803 11.0849 6.02183L12.2339 7.17089L10.7018 8.7029C9.4326 9.97211 9.4326 12.0299 10.7018 13.2991C11.971 14.5683 14.0288 14.5683 15.298 13.2991L16.0641 12.5331C16.9054 11.6918 18.2664 11.687 19.1136 12.5187Z" fill="#A787C0"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M13 6.40488L14.1491 5.25581C16.476 2.92893 20.2486 2.92893 22.5755 5.25581C24.9024 7.58268 24.9024 11.3553 22.5755 13.6822L19.9541 16.3035L19.8983 16.3592C19.897 16.3605 19.8956 16.3619 19.8942 16.3633L14.3114 21.9462C13.5871 22.6704 12.4128 22.6704 11.6885 21.9462L3.42454 13.6822C1.09767 11.3553 1.09767 7.58268 3.42454 5.25581C5.75142 2.92893 9.52402 2.92893 11.8509 5.25581L13 6.40488ZM13.5453 21.1801C13.2441 21.4813 12.7558 21.4813 12.4546 21.1801L4.19057 12.9161C2.28677 11.0123 2.28677 7.92564 4.19057 6.02184C6.09438 4.11803 9.18106 4.11803 11.0849 6.02184L12.2339 7.17089L10.7018 8.70291C9.4326 9.97211 9.4326 12.0299 10.7018 13.2991C11.971 14.5683 14.0288 14.5683 15.298 13.2991L16.0641 12.5331C16.9102 11.687 18.2821 11.687 19.1282 12.5331C19.9736 13.3785 19.9743 14.7487 19.1305 15.595C19.1297 15.5957 19.129 15.5965 19.1282 15.5973L13.5453 21.1801ZM21.8095 12.9161L20.8411 13.8844C20.7985 13.1139 20.4828 12.3557 19.8942 11.7671C18.625 10.4979 16.5672 10.4978 15.298 11.767L14.532 12.5331C13.6858 13.3792 12.314 13.3792 11.4678 12.5331C10.6217 11.6869 10.6217 10.3151 11.4678 9.46894L14.9152 6.02184C16.819 4.11803 19.9056 4.11803 21.8095 6.02184C23.7133 7.92564 23.7133 11.0123 21.8095 12.9161Z" fill="white"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M10.6066 11.5895C11.3892 12.35 12.6401 12.3431 13.4142 11.569L14.1213 10.8619C15.2929 9.69032 17.1924 9.69036 18.364 10.8619C18.9073 11.4053 19.1987 12.1052 19.2381 12.8164L20.1319 11.9226C21.8893 10.1652 21.8893 7.31598 20.1319 5.55862C18.3745 3.80126 15.5253 3.80126 13.7679 5.55862L10.5628 8.7639C9.81159 9.53964 9.8124 10.7734 10.5652 11.5481L10.6066 11.5895Z" fill="#DBC6EC"/>
      <path d="M17.6435 11.5557L17.6702 11.5825C18.4372 12.3638 18.4335 13.6186 17.659 14.3954L17.6569 14.3975L12.5035 19.5509C12.2254 19.8289 11.7747 19.8289 11.4966 19.5509L3.86831 11.9226C2.11095 10.1652 2.11095 7.31598 3.86831 5.55862C5.62567 3.80126 8.47492 3.80126 10.2323 5.55862L11.2929 6.61929L9.87868 8.03345C8.70711 9.20503 8.70711 11.1045 9.87868 12.2761C11.0503 13.4477 12.9497 13.4477 14.1213 12.2761L14.8285 11.569C15.6051 10.7925 16.8614 10.788 17.6435 11.5557Z" fill="#EFDFFC"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 5.9122L13.0608 4.85151C15.2087 2.70363 18.6911 2.70363 20.839 4.85151C22.9869 6.9994 22.9869 10.4818 20.839 12.6297L18.4193 15.0494L18.3678 15.1008C18.3665 15.102 18.3653 15.1033 18.364 15.1046L13.2106 20.258C12.542 20.9265 11.4581 20.9265 10.7895 20.258L3.16121 12.6297C1.01332 10.4818 1.01332 6.9994 3.16121 4.85151C5.30909 2.70363 8.7915 2.70363 10.9394 4.85151L12.0001 5.9122ZM12.5035 19.5509C12.2254 19.8289 11.7746 19.8289 11.4966 19.5509L3.86831 11.9226C2.11095 10.1652 2.11095 7.31598 3.86831 5.55862C5.62567 3.80126 8.47492 3.80126 10.2323 5.55862L11.2929 6.61929L9.87868 8.03345C8.70711 9.20503 8.70711 11.1045 9.87868 12.2761C11.0502 13.4477 12.9497 13.4477 14.1213 12.2761L14.8285 11.569C15.6095 10.788 16.8758 10.788 17.6569 11.569C18.4372 12.3494 18.4379 13.6141 17.659 14.3954C17.6583 14.3961 17.6576 14.3968 17.6569 14.3975L12.5035 19.5509ZM20.1319 11.9226L19.2381 12.8164C19.1987 12.1052 18.9073 11.4053 18.364 10.8619C17.1924 9.69036 15.2929 9.69032 14.1213 10.8619L13.4142 11.569C12.6332 12.35 11.3668 12.35 10.5858 11.569C9.80474 10.7879 9.80474 9.52161 10.5858 8.74056L13.7679 5.55862C15.5253 3.80126 18.3745 3.80126 20.1319 5.55862C21.8893 7.31598 21.8893 10.1652 20.1319 11.9226Z" fill="#1A1A1A"/>
    </svg>
  );
}

/* ── Send icon (Life System icon — hardcoded until added to @laerdal/life-react-components) ── */
function SendIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.26398 6.91888C5.04245 5.36766 6.6106 4.17557 8.04621 4.80365L20.3069 10.1679L20.4525 10.2372C21.9033 11.0064 21.8545 13.1547 20.3069 13.832L8.04621 19.1962C6.61058 19.8243 5.04237 18.6323 5.26398 17.081L5.99054 11.9999L5.26398 6.91888ZM7.8675 10.9999H10.0003C10.5524 11.0001 11.0003 11.4478 11.0003 11.9999C11.0003 12.5521 10.5525 12.9998 10.0003 12.9999H7.8675L7.24445 17.3642L19.5052 11.9999L7.24445 6.63568L7.8675 10.9999Z" fill="currentColor"/>
    </svg>
  );
}

/* ── Theme toggle icon ── */
function MoonIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function SunIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Main ── */
export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [openProjectIds, setOpenProjectIds] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [toolActivity, setToolActivity] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [portInputValue, setPortInputValue] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [buildWithLife, setBuildWithLife] = useState(true);
  const [chatPanelWidth, setChatPanelWidth] = useState(340);
  const [lifeUpdate, setLifeUpdate] = useState<{ latest: string; installed: string } | null>(null);
  const [lifeUpdating, setLifeUpdating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldScrollRef = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const accumulatedRef = useRef("");
  const dragStartWidth = useRef(340);

  const onDragHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartWidth.current = chatPanelWidth;
    document.body.classList.add("dragging");
    const onMove = (ev: MouseEvent) => {
      if (dragStartX.current === null) return;
      const delta = ev.clientX - dragStartX.current;
      setChatPanelWidth(Math.max(240, Math.min(600, dragStartWidth.current + delta)));
    };
    const onUp = () => {
      dragStartX.current = null;
      document.body.classList.remove("dragging");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [chatPanelWidth]);

  // CSS variable theme tokens — cascade to all children automatically
  const theme = darkMode ? {
    "--sc-bg": "#111113",
    "--sc-surface": "#1C1C1F",
    "--sc-surface2": "#242428",
    "--sc-border": "#2E2E33",
    "--sc-text": "#F0F0F0",
    "--sc-text-muted": "#999999",
    "--sc-text-subtle": "#666666",
    "--sc-text-faint": "#444444",
    "--sc-hover": "#28282C",
    "--sc-active-bg": "#163746",
    "--sc-active-text": "#7fbcd7",
    "--sc-tag-bg": "#2A2A2E",
    "--sc-input-bg": "#2A2A2E",
  } : {
    "--sc-bg": "#F5F5F5",
    "--sc-surface": "#ffffff",
    "--sc-surface2": "#F8F8F8",
    "--sc-border": "#E8E8EE",
    "--sc-text": "#1A1A1A",
    "--sc-text-muted": "#888888",
    "--sc-text-subtle": "#AAAAAA",
    "--sc-text-faint": "#BBBBBB",
    "--sc-hover": "#F8F8F8",
    "--sc-active-bg": "#d4e9f2",
    "--sc-active-text": "#215369",
    "--sc-tag-bg": "#F0F0F0",
    "--sc-input-bg": "#F8F8F8",
  };

  // Check for Life design system updates on load
  useEffect(() => {
    fetch("/api/life-update")
      .then((r) => r.json())
      .then((d) => { if (d.updateAvailable) setLifeUpdate({ installed: d.installed, latest: d.latest }); })
      .catch(() => {});
  }, []);

  // Sync theme tokens to :root so scrollbars and body pick them up
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [darkMode]);

  useEffect(() => {
    Promise.all([
      fetch("/api/history").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ]).then(([allChats, allProjects]: [Chat[], Project[]]) => {
      setChats(allChats);
      setProjects(allProjects);
      if (allProjects.length > 0) {
        const first = allProjects[0];
        setActiveProject(first);
        setOpenProjectIds([first.id]);
        const pc = allChats.filter((c) => c.projectId === first.id);
        if (pc.length > 0) setActiveChat(pc[0]);
      }
    }).catch(() => {});
  }, []);

  // Only scroll to bottom during active streaming, not when loading a chat
  useEffect(() => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages, streamText, toolActivity]);

  useEffect(() => {
    if (!activeProject) { setPreviewUrl(null); return; }
    let cancelled = false;
    // Set immediately from cached data, then re-detect live
    setPreviewUrl(activeProject.previewUrl ?? null);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((allProjects: Project[]) => {
        if (cancelled) return;
        const fresh = allProjects.find((p) => p.id === activeProject.id);
        if (fresh) {
          setPreviewUrl(fresh.previewUrl ?? null);
          setProjects(allProjects);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [activeProject?.id]);

  const selectProject = useCallback((project: Project) => {
    shouldScrollRef.current = false;
    setActiveProject(project);
    setOpenProjectIds((prev) => prev.includes(project.id) ? prev : [...prev, project.id]);
    setStreamText("");
    setToolActivity(null);
    setErrorMsg(null);
    setChats((current) => {
      const pc = current.filter((c) => c.projectId === project.id);
      setActiveChat(pc.length > 0 ? pc[0] : null);
      return current;
    });
  }, []);

  const closeProjectTab = useCallback((id: string, currentOpenIds: string[], currentProjects: Project[], currentChats: Chat[], currentActive: Project | null) => {
    const next = currentOpenIds.filter((x) => x !== id);
    setOpenProjectIds(next);
    if (currentActive?.id === id) {
      const fallbackId = next[next.length - 1];
      const fallback = fallbackId ? currentProjects.find((p) => p.id === fallbackId) ?? null : null;
      setActiveProject(fallback);
      if (fallback) {
        const pc = currentChats.filter((c) => c.projectId === fallback.id);
        setActiveChat(pc.length > 0 ? pc[0] : null);
      } else {
        setActiveChat(null);
      }
    }
  }, []);

  const newChat = useCallback(() => {
    shouldScrollRef.current = false;
    setActiveChat(null);
    setStreamText("");
    setToolActivity(null);
    setErrorMsg(null);
  }, []);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    shouldScrollRef.current = true;
    setIsStreaming(true);
    setStreamText("");
    setToolActivity(null);
    setErrorMsg(null);

    // Build content — plain text if no attachments, array if attachments present
    let userContent: string | any[] = text;
    if (attachments.length > 0) {
      const blocks: any[] = [];
      for (const f of attachments) {
        if (f.type === "image" && f.dataUrl && f.mediaType) {
          blocks.push({ type: "image", source: { type: "base64", media_type: f.mediaType, data: f.dataUrl.split(",")[1] } });
        } else if (f.type === "text" && f.text) {
          blocks.push({ type: "text", text: `**${f.name}:**\n\`\`\`\n${f.text}\n\`\`\`` });
        } else {
          blocks.push({ type: "text", text: `[Attached file: ${f.name}]` });
        }
      }
      if (text) blocks.push({ type: "text", text });
      userContent = blocks;
    }
    setAttachments([]);
    const userMsg: AnyMessage = { role: "user", content: userContent };
    const messagesToSend = [...(activeChat?.messages ?? []), userMsg];
    const chatId = activeChat?.id ?? Date.now().toString();
    const currentChat: Chat = activeChat
      ? { ...activeChat, messages: messagesToSend }
      : { id: chatId, title: text.slice(0, 60), projectId: activeProject?.id ?? null, messages: messagesToSend, createdAt: new Date().toISOString() };
    setActiveChat(currentChat);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend, projectPath: activeProject?.path ?? null, projectName: activeProject?.name ?? null, buildWithLife }),
        signal: abortController.signal,
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      accumulatedRef.current = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(part.slice(6));
            if (data.type === "text") { accumulatedRef.current += data.text; setStreamText(accumulatedRef.current); setToolActivity(null); }
            else if (data.type === "tool") { setToolActivity(data.label); }
            else if (data.type === "done") {
              const finalChat: Chat = { ...currentChat, messages: data.messages };
              setActiveChat(finalChat);
              setStreamText("");
              setToolActivity(null);
              await fetch("/api/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(finalChat) });
              setChats((prev) => {
                const idx = prev.findIndex((c) => c.id === finalChat.id);
                if (idx >= 0) { const u = [...prev]; u[idx] = finalChat; return u; }
                return [finalChat, ...prev];
              });
            } else if (data.type === "error") {
              setErrorMsg(data.error?.includes("429") || data.error?.includes("rate_limit")
                ? "Rate limit hit — wait a moment and try again."
                : `Error: ${data.error}`);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        const partial = accumulatedRef.current;
        const interruptedText = (partial ? partial + "\n\n" : "") + "*Samaritan was interrupted.*";
        const interruptedChat: Chat = { ...currentChat, messages: [...currentChat.messages, { role: "assistant", content: interruptedText }] };
        setActiveChat(interruptedChat);
        await fetch("/api/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(interruptedChat) });
        setChats((prev) => {
          const idx = prev.findIndex((c) => c.id === interruptedChat.id);
          if (idx >= 0) { const u = [...prev]; u[idx] = interruptedChat; return u; }
          return [interruptedChat, ...prev];
        });
      } else { console.error(err); }
    }
    finally { setIsStreaming(false); setStreamText(""); setToolActivity(null); abortControllerRef.current = null; }
  }, [input, isStreaming, activeChat, activeProject]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const displayMessages = (activeChat?.messages ?? []).filter(isDisplayMessage);
  const openProjects = openProjectIds.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as Project[];

  return (
    <ThemeProvider theme={{}}>
    <div style={{ ...theme as React.CSSProperties, height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "'Lato', sans-serif", background: "var(--sc-bg)" }}>

      {/* ── HEADER ── */}
      <header style={{
        height: 60, flexShrink: 0,
        background: "var(--sc-surface)", borderBottom: "1px solid var(--sc-border)",
        display: "flex", alignItems: "center", padding: "0 20px", gap: 8,
        position: "relative", zIndex: 20,
      }}>
        <SamaritanIcon size={20} dark={darkMode} />
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--sc-text)", letterSpacing: "-0.1px" }}>Samaritan Code</span>
        <span style={{ fontWeight: 400, fontSize: 14, color: "var(--sc-text-muted)", fontFamily: "'Lato', sans-serif" }}>– build with Life</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          <AppIconButton onClick={() => window.location.href = "/design-system"} title="Life Design System">
            <SystemIcons.Legend size="16" color="currentColor" />
          </AppIconButton>
          <AppIconButton onClick={() => setDarkMode((d) => !d)} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </AppIconButton>
          {!sidebarOpen && (
            <IconButton action={() => setSidebarOpen(true)} useTransparentBackground title="Show projects">
              <SystemIcons.ArrowStopLeft size="18" />
            </IconButton>
          )}
        </div>
      </header>

      {/* ── LIFE UPDATE BANNER ── */}
      {lifeUpdate && (
        <div style={{
          background: "#d4e9f2", borderBottom: "1px solid #a9d3e5",
          padding: "7px 20px", display: "flex", alignItems: "center", gap: 10,
          fontSize: 13, fontFamily: "'Lato', sans-serif", color: "#215369", flexShrink: 0,
        }}>
          <SystemIcons.Information size="15" />
          <span>
            Life design system update available — <strong>{lifeUpdate.installed}</strong> → <strong>{lifeUpdate.latest}</strong>
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={async () => {
                setLifeUpdating(true);
                const res = await fetch("/api/life-update", { method: "POST" });
                const data = await res.json();
                setLifeUpdating(false);
                if (data.ok) setLifeUpdate(null);
              }}
              disabled={lifeUpdating}
              style={{
                padding: "4px 14px", borderRadius: 6, border: "1px solid #519dbd",
                background: "#2e7fa1", color: "#fff", fontSize: 12, fontWeight: 600,
                cursor: lifeUpdating ? "default" : "pointer", opacity: lifeUpdating ? 0.6 : 1,
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {lifeUpdating ? "Updating…" : "Update now"}
            </button>
            <button
              onClick={() => setLifeUpdate(null)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#519dbd", display: "flex", alignItems: "center" }}
            >
              <SystemIcons.Close size="14" />
            </button>
          </div>
        </div>
      )}

      {/* ── PROJECT TABS ── */}
      <ProjectTabsBar
        openProjects={openProjects}
        activeProject={activeProject}
        onSelectProject={selectProject}
        onCloseTab={(id) => closeProjectTab(id, openProjectIds, projects, chats, activeProject)}
        onGoHome={() => setActiveProject(null)}
        onNewChat={newChat}
        sidebarOpen={sidebarOpen}
        onShowSidebar={() => setSidebarOpen(true)}
      />

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* 1. CHAT PANEL */}
        {activeProject && (
          <div style={{ width: chatPanelWidth, flexShrink: 0, background: "var(--sc-surface)", borderRight: "1px solid var(--sc-border)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "4px 0 20px rgba(0,0,0,0.12)", zIndex: 10, position: "relative" }}>
            {/* Drag handle */}
            <div
              onMouseDown={onDragHandleMouseDown}
              style={{
                position: "absolute", top: 0, right: 0, width: 4, height: "100%",
                cursor: "col-resize", zIndex: 20,
              }}
            />
            <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid var(--sc-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--sc-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{humanName(activeProject.name)}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 8, color: "#27AE60", fontSize: 12 }}>
                <SystemIcons.CheckMark size="13" />
                <span style={{ fontFamily: "'Lato', sans-serif" }}>Saved</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {displayMessages.length === 0 && !isStreaming && (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <SamaritanIcon size={32} dark={darkMode} />
                  <p style={{ fontSize: 13, color: "var(--sc-text-faint)", margin: 0, textAlign: "center" }}>Ask Samaritan anything about<br /><strong style={{ color: "var(--sc-text-subtle)" }}>{humanName(activeProject.name)}</strong></p>
                </div>
              )}
              {displayMessages.map((msg, i) => {
                const prevMsg = displayMessages[i - 1];
                const showLabel = msg.role === "assistant" && (!prevMsg || prevMsg.role === "user");
                return <ChatMessage key={i} role={msg.role} content={getTextContent(msg.content)} dark={darkMode} showLabel={showLabel} />;
              })}
              {isStreaming && (
                <div>
                  {toolActivity && (
                    <div style={{ marginBottom: 8 }}>
                      <Tag label={toolActivity} variant="accent1" icon={<span style={{ fontSize: 11 }}>⚡</span>} />
                    </div>
                  )}
                  {streamText ? (
                    <ChatMessage
                      role="assistant"
                      content={streamText}
                      streaming
                      dark={darkMode}
                      showLabel={displayMessages.length === 0 || displayMessages[displayMessages.length - 1]?.role === "user"}
                    />
                  ) : !toolActivity && <ThinkingDots />}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: "10px 14px 14px", marginTop: 8 }}>
              {errorMsg && <div style={{ marginBottom: 8 }}><Banner type="critical" size={Size.Small} onClose={() => setErrorMsg(null)}>{errorMsg}</Banner></div>}
              <GradientInput value={input} onChange={setInput} onSend={sendMessage} onStop={stopGeneration} streaming={isStreaming} disabled={false} placeholder="Ask Samaritan..." textareaRef={textareaRef} onKeyDown={handleKeyDown} compact dark={darkMode} attachments={attachments} onAttachmentsChange={setAttachments} />
            </div>
          </div>
        )}

        {/* 2. CENTER */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--sc-bg)" }}>
          {activeProject ? (
            <div style={{ flex: 1, overflow: "hidden", background: "var(--sc-bg)", position: "relative" }}>
              {previewUrl ? (
                <iframe
                  key={previewKey}
                  ref={iframeRef}
                  src={previewUrl}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  title="Project preview"
                />
              ) : (
                <ProjectFiles
                  projectPath={activeProject.path}
                  projectName={activeProject.name}
                  dark={darkMode}
                  portInputValue={portInputValue}
                  onPortInputChange={setPortInputValue}
                  onConnectPort={() => {
                    const raw = portInputValue.trim();
                    if (!raw || !activeProject) return;
                    const url = raw.startsWith("http") ? raw : `http://localhost:${raw}`;
                    setPreviewUrl(url);
                    fetch("/api/preview-port", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectPath: activeProject.path, url }) });
                    setPortInputValue("");
                  }}
                />
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
              <div style={{ width: "100%", maxWidth: 660, display: "flex", flexDirection: "column", gap: 16 }}>
                {errorMsg && <Banner type="critical" onClose={() => setErrorMsg(null)}>{errorMsg}</Banner>}
                {/* Hero */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 8 }}>
                  <SamaritanIcon size={52} dark={darkMode} />
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "var(--sc-text)", letterSpacing: "-0.5px", fontFamily: "'Lato', sans-serif" }}>Samaritan Code</h1>
                </div>
                {/* Design mode toggle */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{
                    display: "inline-flex", borderRadius: 10,
                    background: "var(--sc-tag-bg)", padding: 3, gap: 2,
                  }}>
                    {[
                      { value: true, label: "Build with Life" },
                      { value: false, label: "Build custom" },
                    ].map(({ value, label }) => {
                      const active = buildWithLife === value;
                      return (
                        <button
                          key={label}
                          onClick={() => setBuildWithLife(value)}
                          style={{
                            padding: "6px 16px", borderRadius: 8, border: "none",
                            fontSize: 13, fontFamily: "'Lato', sans-serif", fontWeight: active ? 700 : 400,
                            cursor: "pointer", transition: "all 0.15s",
                            background: active ? "var(--sc-surface)" : "transparent",
                            color: active ? "var(--sc-text)" : "var(--sc-text-muted)",
                            boxShadow: active ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--sc-text-subtle)", margin: "-4px 0 0", fontFamily: "'Lato', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <span>Starting with Life is easier than retrofitting it later</span>
                  <InfoTip text="Custom styles tend to drift, and realigning them to the design system takes more effort than building on it from day one." />
                </div>
                <GradientInput value={input} onChange={setInput} onSend={sendMessage} disabled={isStreaming} placeholder="Ask questions, describe your new project or open existing projects..." textareaRef={textareaRef} onKeyDown={handleKeyDown} dark={darkMode} />
              </div>
            </div>
          )}
        </div>

        {/* 3. PROJECTS SIDEBAR */}
        {sidebarOpen && (
          <aside style={{
            width: 220, flexShrink: 0,
            background: "var(--sc-surface)", borderLeft: "1px solid var(--sc-border)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.12)", zIndex: 10, position: "relative",
          }}>
            <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--sc-text)" }}>Projects</span>
              <AppIconButton onClick={() => setSidebarOpen(false)} title="Collapse panel">
                <SystemIcons.ArrowStopRight size="16" color="currentColor" />
              </AppIconButton>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}>
              {projects.map((p) => {
                let port: string | null = null;
                try { port = p.previewUrl ? new URL(p.previewUrl).port || null : null; } catch {}
                return (
                  <ProjectItem
                    key={p.id}
                    name={p.name}
                    port={port}
                    active={activeProject?.id === p.id}
                    mobile={p.mobile}
                    onClick={() => selectProject(p)}
                  />
                );
              })}

            </div>
          </aside>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        textarea::placeholder { color: #666666; font-style: italic; }
        body.dragging { user-select: none; cursor: col-resize; }
      `}</style>
    </div>
    </ThemeProvider>
  );
}

/* ── Gradient input ── */
function GradientInput({ value, onChange, onSend, onStop, streaming, disabled, placeholder, textareaRef, onKeyDown, compact, dark, attachments, onAttachmentsChange }: {
  value: string; onChange: (v: string) => void; onSend: () => void; onStop?: () => void;
  streaming?: boolean; disabled: boolean; placeholder: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  compact?: boolean; dark?: boolean;
  attachments?: AttachedFile[]; onAttachmentsChange?: (files: AttachedFile[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      const isImage = file.type.startsWith("image/");
      const isText = file.type.startsWith("text/") || /\.(ts|tsx|js|jsx|json|md|css|html|py|sh|yaml|yml|env|txt)$/i.test(file.name);
      if (isImage) {
        reader.onload = (e) => {
          onAttachmentsChange?.([...(attachments ?? []), { name: file.name, type: "image", dataUrl: e.target?.result as string, mediaType: file.type }]);
        };
        reader.readAsDataURL(file);
      } else if (isText) {
        reader.onload = (e) => {
          onAttachmentsChange?.([...(attachments ?? []), { name: file.name, type: "text", text: e.target?.result as string }]);
        };
        reader.readAsText(file);
      } else {
        onAttachmentsChange?.([...(attachments ?? []), { name: file.name, type: "other" }]);
      }
    });
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #af50af 0%, #5f73ba 100%)",
      borderRadius: compact ? 24 : 40, padding: 2,
    }}>
      <div style={{
        background: dark ? "#1C1C1F" : "#ffffff", borderRadius: compact ? 22 : 38,
        padding: compact ? "10px 14px 8px" : "16px 16px 12px",
        display: "flex", flexDirection: "column", gap: compact ? 6 : 10,
      }}>
        {/* Attachment chips */}
        {attachments && attachments.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {attachments.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 5, padding: "3px 8px 3px 6px",
                borderRadius: 20, background: dark ? "#2A2A2E" : "#F0F0F0",
                fontSize: 12, color: dark ? "#ccc" : "#555", fontFamily: "'Lato', sans-serif",
              }}>
                {f.type === "image" ? <SystemIcons.Image size="13" /> : <SystemIcons.Document size="13" />}
                <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <span
                  onClick={() => onAttachmentsChange?.(attachments.filter((_, j) => j !== i))}
                  style={{ cursor: "pointer", opacity: 0.5, lineHeight: 1, marginLeft: 2 }}
                >✕</span>
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); const el = e.currentTarget; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 140) + "px"; }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={placeholder}
          style={{
            width: "100%", border: "none", outline: "none", resize: "none",
            background: "transparent", fontFamily: "'Lato', sans-serif",
            fontSize: compact ? 14 : 15, color: dark ? "#F0F0F0" : "#1A1A1A",
            fontStyle: value ? "normal" : "italic",
            lineHeight: 1.5, maxHeight: 140, overflowY: "auto", display: "block",
            margin: 0, padding: 0,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div style={{ marginLeft: -8 }}>
            <AppIconButton onClick={() => fileInputRef.current?.click()} title="Attach files">
              <SystemIcons.Attachment size="20" color="currentColor" />
            </AppIconButton>
          </div>
          <div style={{ marginRight: -16 }}>
            <IconButton
              action={streaming ? (onStop ?? (() => {})) : onSend}
              variant="primary"
              shape="circular"
              disabled={!streaming && (!value.trim() && (!attachments || attachments.length === 0))}
              title={streaming ? "Stop generation" : "Send"}
            >
              {streaming ? <SystemIcons.Stop size="18" /> : <SendIcon size={18} />}
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat message ── */
function ChatMessage({ role, content, streaming, dark, showLabel }: { role: string; content: string; streaming?: boolean; dark?: boolean; showLabel?: boolean }) {
  const isUser = role === "user";
  return (
    <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
      {!isUser && showLabel && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <SamaritanIcon size={14} dark={dark} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--sc-text)" }}>Samaritan</span>
        </div>
      )}
      <div style={{
        maxWidth: "88%",
        background: isUser ? (dark ? "#2A2A2E" : "#F0F0F0") : "transparent",
        borderRadius: isUser ? 14 : 0,
        borderBottomRightRadius: isUser ? 4 : 0,
        padding: isUser ? "9px 13px" : "0",
        fontSize: 14, lineHeight: 1.6, color: "var(--sc-text)",
      }}>
        {isUser ? (
          <span style={{ whiteSpace: "pre-wrap" }}>{content}</span>
        ) : (
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content + (streaming ? "▋" : "")}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Thinking dots ── */
/* ── File type → icon mapping ── */
function FileIcon({ name, isDir, dark }: { name: string; isDir: boolean; dark?: boolean }) {
  const color = dark ? "#999" : "#666";
  if (isDir) return <SystemIcons.Folder size="22" color="#2e7fa1" />;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png","jpg","jpeg","gif","svg","webp"].includes(ext)) return <SystemIcons.Image size="22" color={color} />;
  if (["mp4","mov","avi","webm"].includes(ext)) return <SystemIcons.Video size="22" color={color} />;
  if (["pdf"].includes(ext)) return <SystemIcons.ExportPDF size="22" color="#dc3449" />;
  if (["csv"].includes(ext)) return <SystemIcons.ExportCVS size="22" color="#14892f" />;
  if (["doc","docx"].includes(ext)) return <SystemIcons.ExportDoc size="22" color="#2e7fa1" />;
  if (["xls","xlsx"].includes(ext)) return <SystemIcons.ExportEXL size="22" color="#14892f" />;
  return <SystemIcons.Document size="22" color={color} />;
}

function formatSize(bytes: number | null): string {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileEntry { name: string; path: string; isDir: boolean; size: number | null; modified: string | null; }

function ProjectFiles({ projectPath, projectName, dark, portInputValue, onPortInputChange, onConnectPort }: {
  projectPath: string; projectName: string; dark?: boolean;
  portInputValue: string; onPortInputChange: (v: string) => void; onConnectPort: () => void;
}) {
  const [currentPath, setCurrentPath] = useState(projectPath);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/files?path=${encodeURIComponent(currentPath)}`)
      .then((r) => r.json())
      .then((data) => { setFiles(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [currentPath]);

  const openFile = (filePath: string) => {
    fetch("/api/open-file", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: filePath }) });
  };

  const isRoot = currentPath === projectPath;
  const relativePath = currentPath.replace(projectPath, "").replace(/^\//, "");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--sc-bg)" }}>
      {/* Toolbar */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--sc-border)", display: "flex", alignItems: "center", gap: 8, background: "var(--sc-surface)", flexShrink: 0 }}>
        {!isRoot && (
          <IconButton action={() => setCurrentPath(currentPath.split("/").slice(0, -1).join("/") || projectPath)} useTransparentBackground title="Back">
            <SystemIcons.ChevronLeft size="16" />
          </IconButton>
        )}
        <SystemIcons.Folder size="15" color="#2e7fa1" />
        <span style={{ fontSize: 13, color: "var(--sc-text)", fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
          {isRoot ? projectName.replace(/-/g, " ") : relativePath}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {showConnect ? (
            <form onSubmit={(e) => { e.preventDefault(); onConnectPort(); setShowConnect(false); }} style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                autoFocus
                value={portInputValue}
                onChange={(e) => onPortInputChange(e.target.value)}
                placeholder="Port e.g. 3001"
                style={{
                  width: 140, height: 30, border: "1px solid var(--sc-border)", borderRadius: 6,
                  padding: "0 10px", fontSize: 12, fontFamily: "'Lato', sans-serif",
                  color: "var(--sc-text)", outline: "none", background: "var(--sc-surface)",
                }}
              />
              <TextButton variant="primary" size={Size.Small} onClick={onConnectPort}>Connect</TextButton>
              <IconButton action={() => setShowConnect(false)} useTransparentBackground title="Cancel"><SystemIcons.Close size="14" /></IconButton>
            </form>
          ) : (
            <button
              onClick={() => setShowConnect(true)}
              title="Connect a preview port"
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--sc-border)", background: "transparent", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12, color: "var(--sc-text-muted)" }}
            >
              <SystemIcons.Play size="13" />
              Connect preview
            </button>
          )}
        </div>
      </div>

      {/* File grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "80px 80px 16px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}><LoadingIndicator /></div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60, color: "var(--sc-text-faint)", fontSize: 13, fontFamily: "'Lato', sans-serif" }}>
            This folder is empty
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
            {files.map((f) => (
              <FileCard key={f.path} file={f} dark={dark} onOpen={() => f.isDir ? setCurrentPath(f.path) : openFile(f.path)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileCard({ file, dark, onOpen }: { file: FileEntry; dark?: boolean; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      title={file.name}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        padding: "12px 8px 10px", borderRadius: 10, cursor: "pointer", textAlign: "center",
        background: hover ? "var(--sc-hover)" : "transparent",
        border: "1px solid", borderColor: hover ? "var(--sc-border)" : "transparent",
        transition: "all 0.1s",
      }}
    >
      <FileIcon name={file.name} isDir={file.isDir} dark={dark} />
      <span style={{
        fontSize: 11, color: "var(--sc-text)", fontFamily: "'Lato', sans-serif", lineHeight: 1.3,
        wordBreak: "break-all", maxWidth: "100%",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {file.name}
      </span>
      {file.size !== null && (
        <span style={{ fontSize: 10, color: "var(--sc-text-faint)", fontFamily: "'Lato', sans-serif" }}>
          {formatSize(file.size)}
        </span>
      )}
    </div>
  );
}

function AppIconButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
      style={{
        width: 48, height: 48, borderRadius: "50%", border: "none", cursor: "pointer",
        background: "transparent",
        color: hover ? "#215369" : "#949494",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "color 0.15s", flexShrink: 0, padding: 0, position: "relative",
      }}
    >
      <span style={{
        position: "absolute", width: 36, height: 36, borderRadius: "50%",
        background: hover ? "#d4e9f2" : "transparent",
        transition: "background 0.15s",
      }} />
      <span style={{ position: "relative", display: "flex" }}>{children}</span>
    </button>
  );
}

function InfoTip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ display: "flex", alignItems: "center", cursor: "default", color: "var(--sc-text-faint)" }}
      >
        <SystemIcons.Information size="13" />
      </span>
      {visible && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "var(--sc-surface)", border: "1px solid var(--sc-border)",
          borderRadius: 8, padding: "8px 12px",
          fontSize: 11, color: "var(--sc-text-muted)", lineHeight: 1.5,
          width: 240, textAlign: "left",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          pointerEvents: "none", zIndex: 50,
          whiteSpace: "normal",
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, paddingLeft: 20 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sc-border)", animation: `bounce 1.2s ${i * 0.18}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

/* ── Project item (sidebar) ── */
function ProjectItem({ name, port, active, mobile, onClick }: { name: string; port?: string | null; active?: boolean; mobile?: boolean; onClick: () => void; }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 6, marginBottom: 1, cursor: "pointer", background: active ? "var(--sc-active-bg)" : hover ? "var(--sc-hover)" : "transparent" }}
    >
      <span style={{ flex: 1, fontSize: 13, color: active ? "var(--sc-active-text)" : "var(--sc-text)", fontWeight: active ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </span>
      {mobile && (
        <span title="Mobile native" style={{ flexShrink: 0, color: "var(--sc-text-subtle)", display: "flex", alignItems: "center" }}>
          <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
            <rect x="0.5" y="0.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="5.5" cy="11" r="0.8" fill="currentColor"/>
            <line x1="3.5" y1="2.5" x2="7.5" y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </span>
      )}
      {port && (
        <span style={{
          fontSize: 10, color: "var(--sc-text-muted)", fontFamily: "monospace",
          background: "var(--sc-tag-bg)", borderRadius: 4,
          padding: "1px 5px", flexShrink: 0, letterSpacing: "0.02em",
        }}>
          :{port}
        </span>
      )}
    </div>
  );
}

/* ── Conversation item (sidebar) ── */

/* ── Project tabs bar ── */
function ProjectTabsBar({ openProjects, activeProject, onSelectProject, onCloseTab, onGoHome, onNewChat, sidebarOpen, onShowSidebar }: {
  openProjects: Project[];
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
  onCloseTab: (id: string) => void;
  onGoHome: () => void;
  onNewChat: () => void;
  sidebarOpen: boolean;
  onShowSidebar: () => void;
}) {
  return (
    <div style={{
      background: "var(--sc-surface)",
      borderBottom: "1px solid var(--sc-border)",
      display: "flex", alignItems: "stretch", height: 38, flexShrink: 0,
      overflowX: "auto", overflowY: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)", position: "relative", zIndex: 10,
    }}>
      <ProjectTabItem label="" icon={<SystemIcons.Home size="14" />} active={!activeProject} onClick={onGoHome} showClose={false} />
      {openProjects.map((p) => (
        <ProjectTabItem key={p.id} label={p.name} icon={<SystemIcons.Folder size="12" />} active={activeProject?.id === p.id} onClick={() => onSelectProject(p)} onClose={() => onCloseTab(p.id)} />
      ))}
      {activeProject && <NewChatTabButton onClick={onGoHome} />}
      {/* Spacer */}
      <div style={{ flex: 1 }} />
      {/* Reopen chat panel */}
      {!sidebarOpen && (
        <button
          onClick={onShowSidebar}
          title="Open projects panel"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "0 14px", flexShrink: 0,
            background: "transparent", border: "none",
            color: "var(--sc-text-muted)", cursor: "pointer", fontSize: 12,
            fontFamily: "'Lato', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--sc-hover)"; e.currentTarget.style.color = "var(--sc-text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sc-text-muted)"; }}
        >
          <SystemIcons.OpenFolder size="14" />
          Projects
        </button>
      )}
    </div>
  );
}

function NewChatTabButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="New conversation"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 38, flexShrink: 0,
        background: hover ? "var(--sc-hover)" : "transparent",
        border: "none",
        color: "var(--sc-text-muted)", cursor: "pointer",
        transition: "background 0.1s",
      }}
    >
      <SystemIcons.Plus size="14" />
    </button>
  );
}

function ProjectTabItem({ label, icon, active, onClick, onClose, showClose = true }: {
  label: string; icon: React.ReactNode; active: boolean;
  onClick: () => void; onClose?: () => void; showClose?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: label ? "0 10px 0 14px" : "0 12px",
        fontSize: 12, fontWeight: active ? 700 : 500,
        color: active ? "var(--sc-text)" : "var(--sc-text-muted)",
        background: active ? "var(--sc-tag-bg)" : hover ? "var(--sc-hover)" : "transparent",
        borderRight: "1px solid var(--sc-border)",
        whiteSpace: "nowrap", fontFamily: "'Lato', sans-serif",
        flexShrink: 0, cursor: "pointer", transition: "background 0.1s",
      }}
    >
      <span style={{ opacity: active ? 0.8 : 0.5, flexShrink: 0, display: "flex", alignItems: "center" }}>{icon}</span>
      {label && <span>{label}</span>}
      {showClose && (
        <span
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
          title="Close"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16, borderRadius: "50%",
            color: "var(--sc-text-muted)", cursor: "pointer", flexShrink: 0,
            fontSize: 10, lineHeight: 1,
            opacity: hover || active ? 1 : 0, transition: "opacity 0.15s",
            background: hover ? "var(--sc-border)" : "transparent",
          }}
        >✕</span>
      )}
    </div>
  );
}
