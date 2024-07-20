
export function obfuscateJSON(jsonData) {
  // Helper function to recursively convert object keys and values to Base64
  function obfuscateObject(obj) {
      if (typeof obj === 'string') {
          return btoa(encodeURIComponent(obj));
      } else if (typeof obj === 'number' || typeof obj === 'boolean') {
          return obj; // Leave numbers and booleans as they are
      } else if (Array.isArray(obj)) {
          return obj.map(item => obfuscateObject(item));
      } else if (typeof obj === 'object' && obj !== null) {
          return Object.fromEntries(
              Object.entries(obj).map(([key, value]) => [btoa(encodeURIComponent(key)), obfuscateObject(value)])
          );
      }
      return obj;
  }

  return btoa(encodeURIComponent(JSON.stringify(obfuscateObject(jsonData))));
}

// Function to de-obfuscate JSON data
export function deobfuscateJSON(obfuscatedData) {
  // Helper function to recursively convert object keys and values from Base64
  function deobfuscateObject(obj) {
      if (typeof obj === 'string') {
          return decodeURIComponent(atob(obj));
      } else if (typeof obj === 'number' || typeof obj === 'boolean') {
          return obj; // Leave numbers and booleans as they are
      } else if (Array.isArray(obj)) {
          return obj.map(item => deobfuscateObject(item));
      } else if (typeof obj === 'object' && obj !== null) {
          return Object.fromEntries(
              Object.entries(obj).map(([key, value]) => [decodeURIComponent(atob(key)), deobfuscateObject(value)])
          );
      }
      return obj;
  }

  return deobfuscateObject(JSON.parse(decodeURIComponent(atob(obfuscatedData))));
}
