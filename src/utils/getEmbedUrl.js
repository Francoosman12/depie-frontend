const getEmbedUrl = (url) => {
    if (!url) return ""; // ✅ Si no hay URL, retornar vacío
  
    // Si la URL ya está en formato embed, no hacer nada
    if (url.includes("youtube.com/embed")) {
      return url;
    }
  
    // Convertir desde "watch?v=" o "youtu.be"
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0]; // ✅ Remover parámetros extra
      return `https://www.youtube.com/embed/${videoId}`;
    }
  
    return url; // Mantener la URL tal como está si no es de YouTube
  };

  export default getEmbedUrl;