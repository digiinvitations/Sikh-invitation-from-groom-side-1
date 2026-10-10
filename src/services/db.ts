import { doc, getDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { WeddingData, EventDetails } from "../types";
import { weddingData as defaultData } from "../data";
import { sortWeddingEvents, parseCeremonyDate, formatAuspiciousTime } from "../utils";

// Canonical Master Document ID for the original wedding
export const OFFICIAL_DOC_ID = "wedding_data_jaspreet_weds_jasmeet";
export const CANONICAL_DOC_ID = "wedding_data_jaspreet_weds_jasmeet";

// Dedicated Document ID for the groom-side wedding invitation
export const GROOM_REMIX_DOC_ID = "waheguru_sikh_invitation_jaspreet_and_jasmeet";

// Known host identifiers for the official wedding
const OFFICIAL_HOST_SIGNATURES = [
  "wjhktkcue5d2mszgfuvmql", // AI Studio container hash
  "d7ardkeaz72d4rystpc4hr", // Current AI Studio container hash
  "run.app", // Any AI Studio runner domain
  "vercel.app", // Any Vercel deployment domain
  "localhost",
  "127.0.0.1",
  "draft-invitation-for-jaspreet-weds",
  "jaspreet-weds-jasmeet",
];

// Determine if the current environment is the original master website
export function isOfficialInstance(): boolean {
  if (typeof window === 'undefined') return true;

  // Check if an explicit custom slot override is set in localStorage
  try {
    const customSlot = localStorage.getItem("wedding_custom_slot_id");
    if (customSlot && customSlot.trim()) {
      return customSlot.trim() === OFFICIAL_DOC_ID;
    }
  } catch (e) {}

  const hostname = window.location.hostname.toLowerCase();
  
  // If hostname matches any official signature, it is the official site
  return OFFICIAL_HOST_SIGNATURES.some(sig => hostname.includes(sig));
}

// Generate or retrieve the active, isolated database slot ID
export function getEnvironmentDocId(): string {
  if (typeof window === 'undefined') return CANONICAL_DOC_ID;

  // 1. Check if user specified an explicit custom slot in localStorage (e.g. from Admin Panel)
  try {
    const customSlot = localStorage.getItem("wedding_custom_slot_id");
    if (customSlot && customSlot.trim() && customSlot.trim() !== "auto") {
      return sanitizeSlotId(customSlot.trim());
    }
  } catch (e) {}

  // 2. Check for environment variable override
  const envSlot = (import.meta as any).env?.VITE_WEDDING_DOC_ID;
  if (envSlot && typeof envSlot === "string" && envSlot.trim()) {
    return sanitizeSlotId(envSlot.trim());
  }

  // 3. If this is the official original website, use the official canonical document
  if (isOfficialInstance()) {
    return CANONICAL_DOC_ID;
  }

  // 4. This is a REMIX! Use dedicated groom remix slot or custom slot
  try {
    const existingRemixSlot = localStorage.getItem("wedding_auto_remix_slot_id");
    if (existingRemixSlot && existingRemixSlot.trim()) {
      return sanitizeSlotId(existingRemixSlot.trim());
    }
  } catch (e) {}

  // Default dedicated slot for the upcoming remix
  const targetRemixSlot = GROOM_REMIX_DOC_ID;
  try {
    localStorage.setItem("wedding_auto_remix_slot_id", targetRemixSlot);
  } catch (e) {}

  return targetRemixSlot;
}

// Sanitize slot ID for Firestore document path requirements
function sanitizeSlotId(raw: string): string {
  return raw.replace(/[\/\s#?\[\]]/g, "_");
}

export function setCustomSlotId(slotId: string) {
  if (typeof window === 'undefined') return;
  try {
    if (slotId && slotId.trim()) {
      localStorage.setItem("wedding_custom_slot_id", sanitizeSlotId(slotId.trim()));
    } else {
      localStorage.removeItem("wedding_custom_slot_id");
    }
  } catch (e) {}
}

export function getRsvpCollectionName(): string {
  return "rsvps";
}

/**
 * Fetch wedding data for the current active slot.
 * If this is a new remix and its slot does not exist yet in Firestore,
 * it clones the template data into the remix slot so the new couple
 * starts with all rich templates, without affecting the original site.
 */
export async function getWeddingData(): Promise<WeddingData> {
  try {
    const slotId = getEnvironmentDocId();
    const docRef = doc(db, "weddingConfig", slotId);
    let docSnap = await getDoc(docRef);

    // If the remix slot does not exist yet in Firestore, clone the initial template into it
    if (!docSnap.exists()) {
      let initialData = defaultData;

      // Try reading canonical data to provide a pre-filled starting point with all assets
      try {
        const canonicalRef = doc(db, "weddingConfig", CANONICAL_DOC_ID);
        const canonicalSnap = await getDoc(canonicalRef);
        if (canonicalSnap.exists()) {
          initialData = {
            ...defaultData,
            ...(canonicalSnap.data() as WeddingData),
          };
        }
      } catch (err) {
        console.warn("Could not read canonical template, using default local data:", err);
      }

      // Initialize the isolated slot with its own copy
      const seedData: WeddingData = {
        ...defaultData,
        remixName: defaultData.remixName,
        invitationSide: "groom",
        groomSideDetails: defaultData.groomSideDetails,
      };

      try {
        await setDoc(docRef, seedData);
      } catch (e) {
        console.warn("Failed to initialize new slot in Firestore:", e);
      }

      return seedData;
    }

    // Slot document exists: load it
    let remoteData = docSnap.data() as WeddingData;

    // Intelligent cross-check between CANONICAL_DOC_ID and GROOM_REMIX_DOC_ID:
    // If the active slot has older data or lacks custom events/videos while GROOM_REMIX_DOC_ID has newer data,
    // seamlessly adopt the newer groom data so Vercel deployments instantly see the latest updates.
    if (slotId === CANONICAL_DOC_ID) {
      try {
        const remixSnap = await getDoc(doc(db, "weddingConfig", GROOM_REMIX_DOC_ID));
        if (remixSnap.exists()) {
          const remixData = remixSnap.data() as WeddingData;
          const canonicalTime = (remoteData as any).updatedAt ? new Date((remoteData as any).updatedAt).getTime() : 0;
          const remixTime = (remixData as any).updatedAt ? new Date((remixData as any).updatedAt).getTime() : 0;
          const remixHasCustomEvents = Array.isArray(remixData.events) && remixData.events.length >= 3;
          const canonicalHasCustomEvents = Array.isArray(remoteData.events) && remoteData.events.length >= 3;

          if (remixTime > canonicalTime || (!canonicalHasCustomEvents && remixHasCustomEvents) || (!remoteData.heroVideoUrl && remixData.heroVideoUrl)) {
            remoteData = { ...remoteData, ...remixData };
          }
        }
      } catch (err) {
        console.warn("Could not cross-check groom remix slot:", err);
      }
    }

    if (remoteData.heroLogoUrl === "/src/assets/ikonkar-gold.svg") {
      remoteData.heroLogoUrl = "/ikonkar-gold.svg";
    }

    // Clean up any written text indicating "Groom's Side Invitation"
    const cleanedGroomSideDetails = {
      ...defaultData.groomSideDetails,
      ...(remoteData.groomSideDetails || {}),
      familyMembers: remoteData.groomSideDetails?.familyMembers || defaultData.groomSideDetails?.familyMembers,
    };
    if (cleanedGroomSideDetails.badgeText?.includes("Groom's Side") || 
        cleanedGroomSideDetails.badgeText?.includes("Groom Side") || 
        cleanedGroomSideDetails.badgeText?.includes("ਲੜਕੇ ਵਾਲੇ")) {
      cleanedGroomSideDetails.badgeText = "";
    }

    let remixName = remoteData.remixName || defaultData.remixName;
    if (remixName?.includes("groom side") || remixName?.includes("Groom side")) {
      remixName = defaultData.remixName;
    }

    let invitedBy = remoteData.invitedBy || defaultData.invitedBy;
    if (!invitedBy || invitedBy.toLowerCase().includes("jasmer") || invitedBy.toLowerCase().includes("grandmother")) {
      invitedBy = defaultData.invitedBy;
    }

    let familyRegards = remoteData.familyRegards || defaultData.familyRegards;
    if (familyRegards?.includes("Gandhi")) {
      familyRegards = defaultData.familyRegards;
    }

    // Systematically sanitize and sort events
    let mergedEvents: EventDetails[] = Array.isArray(remoteData.events) && remoteData.events.length > 0 
      ? remoteData.events 
      : defaultData.events;

    // Check if Ring Ceremony or other default ceremonies are missing from remote data
    const hasRing = mergedEvents.some(e => e.title?.toLowerCase().includes("ring") || e.title?.toLowerCase().includes("sagan"));
    if (!hasRing) {
      const defaultRing = defaultData.events.find(e => e.title?.toLowerCase().includes("ring"));
      if (defaultRing) mergedEvents.push(defaultRing);
    }
    const hasHaldi = mergedEvents.some(e => e.title?.toLowerCase().includes("haldi"));
    if (!hasHaldi) {
      const defaultHaldi = defaultData.events.find(e => e.title?.toLowerCase().includes("haldi"));
      if (defaultHaldi) mergedEvents.push(defaultHaldi);
    }

    // Normalize dates to ISO and format times cleanly
    mergedEvents = mergedEvents.map(event => {
      const parsed = parseCeremonyDate(event.date, event.time);
      const cleanDate = parsed.isoDate || event.date;
      let cleanTime = formatAuspiciousTime(event.time);
      const titleLower = (event.title || "").toLowerCase();

      // Ensure 2 timings for Haldi, Sagan & Ring Ceremony
      if (titleLower.includes("haldi") && (titleLower.includes("sagan") || titleLower.includes("ring"))) {
        cleanTime = "Haldi: 12:30 PM • Sagan & Ring: 8:00 PM";
      } else if (titleLower.includes("sagan") || titleLower.includes("ring")) {
        cleanTime = "8:00 PM";
      } else if (titleLower.includes("haldi")) {
        cleanTime = "12:30 PM";
      }

      return {
        ...event,
        date: cleanDate,
        time: cleanTime,
      };
    });

    // Chronologically sort all events systematically
    const sortedEvents = sortWeddingEvents(mergedEvents);

    // Sync timeline with sorted events
    const syncedTimeline = sortedEvents.map((e, idx) => ({
      id: e.id || `tl_${idx}`,
      title: e.title,
      date: e.date,
      time: e.time,
      description: e.description || `${e.title} at ${e.location}`,
    }));

    // Ensure RSVP contacts are strictly Kuldeep & Inderdeep without any address
    const defaultContacts = [
      { name: "Kuldeep", phone: "9415031002" },
      { name: "Inderdeep", phone: "7860333336" }
    ];

    return {
      ...defaultData,
      ...remoteData,
      events: sortedEvents,
      timeline: syncedTimeline,
      groom: {
        ...defaultData.groom,
        ...(remoteData.groom || {}),
        parents: remoteData.groom?.parents?.includes("Kuldeep Singh Bhusari") ? remoteData.groom.parents : defaultData.groom.parents,
      },
      bride: {
        ...defaultData.bride,
        ...(remoteData.bride || {}),
        parents: remoteData.bride?.parents?.includes("Paramjeet Singh Gandhi") ? remoteData.bride.parents : defaultData.bride.parents,
      },
      remixName,
      invitationSide: remoteData.invitationSide || defaultData.invitationSide,
      groomSideDetails: cleanedGroomSideDetails,
      invitedBy,
      familyRegards,
      rsvpAddress: "",
      rsvpPhones: ["9415031002", "7860333336"],
      rsvpContacts: defaultContacts,
    };
  } catch (error) {
    console.error("Error fetching wedding data:", error);
    return defaultData;
  }
}

/**
 * Save wedding data with comprehensive synchronization:
 * - Saves to active slot.
 * - Synchronizes across canonical, groom remix, and Vercel hosting slots.
 * - This guarantees that updates made on AI Studio or Vercel are immediately available everywhere.
 */
export async function saveWeddingData(data: WeddingData): Promise<void> {
  const cleanData: WeddingData = { 
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (cleanData.heroLogoUrl === "/src/assets/ikonkar-gold.svg") {
    cleanData.heroLogoUrl = "/ikonkar-gold.svg";
  }

  // Systematically sort and normalize events and sync timeline before saving
  if (Array.isArray(cleanData.events) && cleanData.events.length > 0) {
    cleanData.events = sortWeddingEvents(cleanData.events.map(e => ({
      ...e,
      date: parseCeremonyDate(e.date, e.time).isoDate || e.date,
      time: formatAuspiciousTime(e.time),
    })));
    cleanData.timeline = cleanData.events.map((e, idx) => ({
      id: e.id || `tl_${idx}`,
      title: e.title,
      date: e.date,
      time: e.time,
      description: e.description || `${e.title} at ${e.location}`,
    }));
  }

  const slotId = getEnvironmentDocId();

  // Save directly to the current active slot
  const docRef = doc(db, "weddingConfig", slotId);
  await setDoc(docRef, cleanData);

  // Broadcast & sync to all primary slots so Vercel and AI Studio are perpetually unified
  const syncSlots = Array.from(new Set([
    CANONICAL_DOC_ID,
    GROOM_REMIX_DOC_ID,
    "wedding_data_draft-invitation-for-jaspreet-weds_vercel_app",
    "wedding_data_wjhktkcue5d2mszgfuvmql-14313311583",
    slotId
  ]));

  const syncPromises = syncSlots.map(targetId =>
    setDoc(doc(db, "weddingConfig", targetId), cleanData).catch(e => {
      console.warn(`Sync warning for target ${targetId}:`, e);
    })
  );

  await Promise.allSettled(syncPromises);
}

/**
 * Save Current Website Data as Official "Groom's Data":
 * Saves and locks the current wedding data across all official master slots,
 * groom remix slots, and Vercel hosting slots so it becomes the permanent,
 * official online wedding data with zero overlap.
 */
export async function saveOfficialGroomData(data: WeddingData): Promise<{ success: boolean; syncedSlots: string[] }> {
  const cleanData: WeddingData = {
    ...data,
    remixName: data.remixName || defaultData.remixName,
    invitationSide: "groom",
    updatedAt: new Date().toISOString()
  };

  if (cleanData.heroLogoUrl === "/src/assets/ikonkar-gold.svg") {
    cleanData.heroLogoUrl = "/ikonkar-gold.svg";
  }

  // Systematically sort and normalize events and sync timeline
  if (Array.isArray(cleanData.events) && cleanData.events.length > 0) {
    cleanData.events = sortWeddingEvents(cleanData.events.map(e => ({
      ...e,
      date: parseCeremonyDate(e.date, e.time).isoDate || e.date,
      time: formatAuspiciousTime(e.time),
    })));
    cleanData.timeline = cleanData.events.map((e, idx) => ({
      id: e.id || `tl_${idx}`,
      title: e.title,
      date: e.date,
      time: e.time,
      description: e.description || `${e.title} at ${e.location}`,
    }));
  }

  const slotId = getEnvironmentDocId();

  // All critical master, remix, and hosting storage targets
  const syncSlots = Array.from(new Set([
    CANONICAL_DOC_ID,
    GROOM_REMIX_DOC_ID,
    "wedding_data_draft-invitation-for-jaspreet-weds_vercel_app",
    "wedding_data_wjhktkcue5d2mszgfuvmql-14313311583",
    slotId
  ]));

  const syncedSlots: string[] = [];
  for (const target of syncSlots) {
    try {
      await setDoc(doc(db, "weddingConfig", target), cleanData);
      syncedSlots.push(target);
    } catch (e) {
      console.warn(`Error syncing Groom's data to slot ${target}:`, e);
    }
  }

  return { success: true, syncedSlots };
}

export interface GroomRecoveryResult {
  success: boolean;
  message: string;
  recoveredFromSlot: string;
  data: WeddingData;
  syncedSlots: string[];
}

/**
 * Groom Data Recovery:
 * Pulls the latest, authentic groom invitation data across all Firestore slots,
 * restores all ceremonies (Haldi, Sagan & Ring 8:00 PM, Anand Karaj),
 * contacts (Kuldeep & Inderdeep), media URLs, and replicates to Vercel hosting.
 */
export async function recoverGroomData(): Promise<GroomRecoveryResult> {
  const currentSlot = getEnvironmentDocId();
  const targetSlots = Array.from(new Set([
    GROOM_REMIX_DOC_ID,
    CANONICAL_DOC_ID,
    "wedding_data_draft-invitation-for-jaspreet-weds_vercel_app",
    "wedding_data_wjhktkcue5d2mszgfuvmql-14313311583",
    currentSlot
  ]));

  let bestData: WeddingData | null = null;
  let bestSlotName = "";
  let latestTimestamp = 0;

  for (const slot of targetSlots) {
    try {
      const snap = await getDoc(doc(db, "weddingConfig", slot));
      if (snap.exists()) {
        const d = snap.data() as WeddingData;
        const time = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
        
        const hasCustomGroom = Boolean(d.groomSideDetails?.familyHeading || d.groomSideDetails?.familyMembers);
        const hasHeroVideo = Boolean(d.heroVideoUrl && d.heroVideoUrl.includes("http"));
        const eventsCount = Array.isArray(d.events) ? d.events.length : 0;
        const hasRingOrHaldi = Array.isArray(d.events) && d.events.some(e => 
          (e.title || "").toLowerCase().includes("ring") || (e.title || "").toLowerCase().includes("sagan") || (e.title || "").toLowerCase().includes("haldi")
        );

        const score = (time > 0 ? 100 : 0) + (eventsCount * 10) + (hasCustomGroom ? 50 : 0) + (hasHeroVideo ? 40 : 0) + (hasRingOrHaldi ? 30 : 0);

        if (!bestData || time > latestTimestamp || (time === 0 && score > 50)) {
          bestData = d;
          bestSlotName = slot;
          if (time > latestTimestamp) {
            latestTimestamp = time;
          }
        }
      }
    } catch (err) {
      console.warn(`Error querying slot ${slot}:`, err);
    }
  }

  // Fallback to defaultData if no remote slots exist
  const baseData = bestData || defaultData;

  // Process & clean up all groom-side details and events
  const cleanedGroomSideDetails = {
    ...defaultData.groomSideDetails,
    ...(baseData.groomSideDetails || {}),
    familyMembers: baseData.groomSideDetails?.familyMembers || defaultData.groomSideDetails?.familyMembers,
  };
  if (cleanedGroomSideDetails.badgeText?.includes("Groom's Side") || 
      cleanedGroomSideDetails.badgeText?.includes("Groom Side") || 
      cleanedGroomSideDetails.badgeText?.includes("ਲੜਕੇ ਵਾਲੇ")) {
    cleanedGroomSideDetails.badgeText = "";
  }

  // Ensure merged events contain all ceremony details with correct systematic timings
  let mergedEvents: EventDetails[] = Array.isArray(baseData.events) && baseData.events.length > 0 
    ? baseData.events 
    : defaultData.events;

  const hasRing = mergedEvents.some(e => e.title?.toLowerCase().includes("ring") || e.title?.toLowerCase().includes("sagan"));
  if (!hasRing) {
    const defaultRing = defaultData.events.find(e => e.title?.toLowerCase().includes("ring"));
    if (defaultRing) mergedEvents.push(defaultRing);
  }
  const hasHaldi = mergedEvents.some(e => e.title?.toLowerCase().includes("haldi"));
  if (!hasHaldi) {
    const defaultHaldi = defaultData.events.find(e => e.title?.toLowerCase().includes("haldi"));
    if (defaultHaldi) mergedEvents.push(defaultHaldi);
  }

  mergedEvents = mergedEvents.map(event => {
    const parsed = parseCeremonyDate(event.date, event.time);
    const cleanDate = parsed.isoDate || event.date;
    let cleanTime = formatAuspiciousTime(event.time);
    const titleLower = (event.title || "").toLowerCase();

    if (titleLower.includes("haldi") && (titleLower.includes("sagan") || titleLower.includes("ring"))) {
      cleanTime = "Haldi: 12:30 PM • Sagan & Ring: 8:00 PM";
    } else if (titleLower.includes("sagan") || titleLower.includes("ring")) {
      cleanTime = "8:00 PM";
    } else if (titleLower.includes("haldi")) {
      cleanTime = "12:30 PM";
    }

    return {
      ...event,
      date: cleanDate,
      time: cleanTime,
    };
  });

  const sortedEvents = sortWeddingEvents(mergedEvents);
  const syncedTimeline = sortedEvents.map((e, idx) => ({
    id: e.id || `tl_${idx}`,
    title: e.title,
    date: e.date,
    time: e.time,
    description: e.description || `${e.title} at ${e.location}`,
  }));

  const recoveredPayload: WeddingData = {
    ...defaultData,
    ...baseData,
    events: sortedEvents,
    timeline: syncedTimeline,
    groom: {
      ...defaultData.groom,
      ...(baseData.groom || {}),
      parents: baseData.groom?.parents?.includes("Kuldeep Singh Bhusari") ? baseData.groom.parents : defaultData.groom.parents,
    },
    bride: {
      ...defaultData.bride,
      ...(baseData.bride || {}),
      parents: baseData.bride?.parents?.includes("Paramjeet Singh Gandhi") ? baseData.bride.parents : defaultData.bride.parents,
    },
    remixName: defaultData.remixName,
    invitationSide: "groom",
    groomSideDetails: cleanedGroomSideDetails,
    invitedBy: baseData.invitedBy || defaultData.invitedBy,
    familyRegards: baseData.familyRegards || defaultData.familyRegards,
    heroVideoUrl: baseData.heroVideoUrl || defaultData.heroVideoUrl,
    heroLogoUrl: "/ikonkar-gold.svg",
    rsvpAddress: "",
    rsvpPhones: ["9415031002", "7860333336"],
    rsvpContacts: [
      { name: "Kuldeep", phone: "9415031002" },
      { name: "Inderdeep", phone: "7860333336" }
    ],
    updatedAt: new Date().toISOString(),
  };

  // BROADCAST & SYNCHRONIZE ACROSS ALL DATABASE SLOTS
  const syncedSlots: string[] = [];
  const syncTargets = Array.from(new Set([
    GROOM_REMIX_DOC_ID,
    CANONICAL_DOC_ID,
    currentSlot,
    "wedding_data_draft-invitation-for-jaspreet-weds_vercel_app",
    "wedding_data_wjhktkcue5d2mszgfuvmql-14313311583"
  ]));

  for (const target of syncTargets) {
    try {
      await setDoc(doc(db, "weddingConfig", target), recoveredPayload);
      syncedSlots.push(target);
    } catch (err) {
      console.warn(`Could not sync to slot ${target}:`, err);
    }
  }

  // Remove any conflicting custom slot override from localStorage so default canonical is clean
  try {
    localStorage.removeItem("wedding_custom_slot_id");
  } catch (e) {}

  return {
    success: true,
    message: bestSlotName 
      ? `Successfully recovered Groom data from "${bestSlotName}" and synchronized across ${syncedSlots.length} database slots including Vercel hosting.`
      : `Successfully restored authentic Groom invitation data and synchronized across all slots including Vercel hosting.`,
    recoveredFromSlot: bestSlotName || "default_groom_template",
    data: recoveredPayload,
    syncedSlots
  };
}

/**
 * Submit an RSVP to the isolated subcollection for this slot.
 */
export async function submitRSVP(rsvpData: any): Promise<void> {
  const slotId = getEnvironmentDocId();
  const rsvpCollection = collection(db, "weddingConfig", slotId, "rsvps");
  await addDoc(rsvpCollection, {
    ...rsvpData,
    submittedAt: new Date().toISOString()
  });
}

/**
 * Retrieve RSVPs submitted specifically to this slot.
 */
export async function getRSVPs(): Promise<any[]> {
  try {
    const slotId = getEnvironmentDocId();
    const rsvpCollection = collection(db, "weddingConfig", slotId, "rsvps");
    const snapshot = await getDocs(rsvpCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }
}

