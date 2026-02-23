// WhatsApp group links for events
// Map event IDs to their WhatsApp group links
// If an event doesn't have a link, it will default to example.com

export const whatsappLinks = {
  // Example format:
  "EVNT01": "https://chat.whatsapp.com/KRdj7RgbrpbB0ew9qFI9kG?mode=gi_t",
  "EVNT02": "https://chat.whatsapp.com/FIZGPQLvz5t0eIq1OaUsSC?mode=hqctcla",
  "EVNT03": "https://chat.whatsapp.com/DMQUNVJ1m4105pyfcXWQCD?mode=gi_t",
  "EVNT04": "https://chat.whatsapp.com/FjWj2j4TTKDAVXs1Vira88",
  "EVNT05": "https://chat.whatsapp.com/JvLK5WCxsSe4V6oPZlq0Si?mode=gi_t",
  "EVNT07": "https://chat.whatsapp.com/BsCTHklNkzqGIjP6EmMrYR?mode=gi_t",
  "EVNT08": "https://chat.whatsapp.com/BkSOb82ZtBML12FNhE8MQo?mode=gi_t",
  "EVNT09": "https://chat.whatsapp.com/KBHqkn1albI92kwyC7Cpsz?mode=gi_t",
  "EVNT10": "https://chat.whatsapp.com/FWc5JziAq4V0T9dlUxUKO0?mode=gi_t",
  "EVNT12": "https://chat.whatsapp.com/GzcukelG5olEowDI5Pyv4X?mode=gi_t",
  "EVNT13": "https://chat.whatsapp.com/IPj9DNoWK3cDjQxiN4Eysn?mode=gi_t",
  "EVNT16": "https://chat.whatsapp.com/KheWHsFkkgvFnWwSOkWNYA",
  "EVNT17": "https://chat.whatsapp.com/BSJQXSI47Fm9GAwOV7wZ41?mode=gi_t",
  "EVNT18": "https://chat.whatsapp.com/D10Av36T2r616e9SVMpO3g",
  "EVNT19": "https://chat.whatsapp.com/C11ecxB9dK87jQdzCxNOpN?mode=gi_t",
  "EVNT20": "https://chat.whatsapp.com/HWbbXB4Zi4l7RjALUTRH1z",
  "EVNT21": "https://chat.whatsapp.com/DMeFNreVTk8GJahWGYP9nx?mode=gi_t",
  "EVNT22": "https://chat.whatsapp.com/HbKIsbeI0hyEqetdLPKSFb",
  "EVNT23": "https://chat.whatsapp.com/Jyvtz8h4DaZLycdkxzyzG2?mode=gi_t",
  "EVNT24": "https://chat.whatsapp.com/GBa6lVwjVsOGnMbxONyTYw?mode=gi_t",
  "EVNT25": "https://chat.whatsapp.com/E11yZa7HJGzKwRth5H3xJ9?mode=gi_t",
  "EVNT27": "https://chat.whatsapp.com/Ht5zU2hZOJX8O2YoHTurXI?mode=gi_t",
  "EVNT28": "https://chat.whatsapp.com/E4IYhledTQ263LizgmTmIh?mode=gi_t",
  "EVNT30": "https://chat.whatsapp.com/JpaBmaUoURbJGhWIXdPtH7?mode=gi_t",
  "EVNT31": "https://chat.whatsapp.com/JrgtiU1y8MHAf2huTHfsk0?mode=gi_t",
  "EVNT32": "https://chat.whatsapp.com/E4IYhledTQ263LizgmTmIh?mode=gi_t",
  "EVNT33": "https://chat.whatsapp.com/GNrEyghENsFIDX45MTnlww?mode=gi_t",
  "EVNT34": "https://chat.whatsapp.com/EcPLECPCOeTECMg55CgYwN",
  "EVNT38": "https://chat.whatsapp.com/BeoBPkI0piaFaFRSGk2UkO?mode=gi_t",
  "EVNT39": "https://chat.whatsapp.com/JF0k5k8NNLq1e3cZG9X4f6?mode=gi_t",
  "EVNT40": "https://chat.whatsapp.com/EDvS6BOS5IQ5Q6g2VdpQ5T?mode=gi_t",
  "EVNT06": "https://chat.whatsapp.com/HcmpuKgCmmMAew0mW5VemV?mode=gi_t",
  "EVNT46": "https://chat.whatsapp.com/LQcINI8Joe87DOy1OJozp1",
  
  // Add more event IDs and their WhatsApp links here
};

// Helper function to get WhatsApp link for an event
export const getWhatsAppLink = (eventId) => {
  return whatsappLinks[eventId] || "https://example.com";
};
