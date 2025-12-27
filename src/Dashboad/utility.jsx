export const cities = [
  "Delhi",
  "Gurgaon",
  "Faridabad",
  "Chandigarh",
  "Ghaziabad",
  "Noida",
  "Kolkata",
  "Mumbai",
  "Pune",
  "Varanasi",
  "Mathura",
  "Patna",
  "Meerut",
  "Jaipur",
  "Ranchi",
  "Lucknow",
  "Ahmedabad",
  "Dehradun",
  "Jammu",
  "Gwalior",
  "Bhopal",
  "Indore",
  "Hyderabad",
  "Bengaluru",
  "Mysore",
  "Allahabad",
];
export const normalizeDate = (date) =>
  new Date(date).toISOString().split("T")[0];

export const handleCopy = async (header, body) => {
  // Safety check
  if (!Array.isArray(header) || !Array.isArray(body)) {
    alert("Header and Body must be arrays");
    return;
  }

  if (header.length !== body.length) {
    alert("Header and Body length must be the same");
    return;
  }

  const formattedText = header
    .map((key, index) => `${key}: ${body[index]}`)
    .join("\n");

  await navigator.clipboard.writeText(formattedText);
  alert("Copied to clipboard ✅");
};
