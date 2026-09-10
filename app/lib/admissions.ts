export const REGISTRATION_FEE = 5000;

export const PROGRAMS = [
  { value: "Tailoring", label: "Tailoring / Ubudozi", icon: "needle" },
  {
    value: "Electronic Services",
    label: "Electronic Services",
    icon: "circuit",
  },
  { value: "Masonry", label: "Masonry / Ubwubatsi", icon: "brick" },
  {
    value: "Automobile Repair and Maintenance",
    label: "Automobile Repair & Maintenance",
    icon: "car",
  },
  {
    value: "Church Music Arts",
    label: "Church Music Arts",
    icon: "music",
    restrictedLocation: "Karama",
  },
  {
    value: "Videography",
    label: "Videography",
    icon: "video",
    restrictedLocation: "Karama",
  },
  {
    value: "Mobile Phone Repair",
    label: "Mobile Phone Repair",
    icon: "phone",
    restrictedLocation: "Karama",
  },
  {
    value: "Domestic Electricity",
    label: "Domestic Electricity",
    icon: "electricity",
    restrictedLocation: "Karama",
  },
  { value: "Provisional permit", label: "Provisional Permit", icon: "road" },
  {
    value: "Licence Cat B",
    label: "Driving Licence — Category B",
    icon: "car",
  },
  {
    value: "Licence Cat A",
    label: "Driving Licence — Category A",
    icon: "bike",
  },
] as const;

export const PAYMENT_METHODS = [
  "Bank deposit",
  "Bank transfer",
  "Mobile Money",
  "Other",
] as const;

export const TRAINING_LOCATIONS = [
  { district: "Huye", name: "Karama", detail: "Ruhashya Sector" },
  { district: "Huye", name: "Matyazo", detail: "Ngoma Sector" },
  { district: "Huye", name: "Cyegera", detail: "Kinazi Sector · ADEPR" },
  { district: "Huye", name: "Gihindamuyaga", detail: "Mbazi Sector · EPR" },
  {
    district: "Huye",
    name: "Nyumba",
    detail: "Gishamvu Sector · Catholic Church",
  },
  { district: "Huye", name: "Tumba", detail: "Youth Centre" },
  { district: "Gisagara", name: "Ndora", detail: "Yego Centre / Gymnasium" },
  { district: "Gisagara", name: "Musha", detail: "Yego Centre Musha" },
  {
    district: "Gisagara",
    name: "Mamba",
    detail: "Kabumbwe · below the football field",
  },
  { district: "Gisagara", name: "Mukindo", detail: "EAR" },
  { district: "Gisagara", name: "Kansi", detail: "Catholic Church" },
  { district: "Nyamagabe", name: "Kagano", detail: "EAR · Uwinkingi Sector" },
  { district: "Nyanza", name: "Gisayura", detail: "EAR · Ntyazo Sector" },
] as const;

export const trainingLocationValue = (
  location: (typeof TRAINING_LOCATIONS)[number],
) => `${location.name}, ${location.district} District (${location.detail})`;

// Official financial details were not present in the repository. Keep this as the
// single place to add verified details once ETP supplies them.
export const PAYMENT_INSTRUCTIONS = {
  accountName: "To be provided by ETP",
  bankName: "To be provided by ETP",
  accountNumber: "To be provided by ETP",
  mobileMoneyNumber: "",
  note: "Contact the ETP admissions office for the official payment details before making your payment.",
};

export const formatRwf = (amount: number) =>
  `${amount.toLocaleString("en-RW")} RWF`;
