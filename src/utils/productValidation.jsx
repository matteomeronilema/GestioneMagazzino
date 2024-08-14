export const validateProduct = (product) => {
  const errors = {};

  if (!product.name.trim()) {
    errors.name = "Il nome del prodotto è obbligatorio";
  }

  if (!product.description.trim()) {
    errors.description = "La descrizione del prodotto è obbligatoria";
  }

  if (isNaN(product.price) || product.price <= 0) {
    errors.price = "Il prezzo deve essere un numero positivo";
  }

  const quantity = parseInt(product.quantity, 10);
  if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
    errors.quantity = "La quantità deve essere un numero intero non negativo";
  }

  if (!product.category.trim()) {
    errors.category = "La categoria del prodotto è obbligatoria";
  }

  if (product.imageUrl && !isValidUrl(product.imageUrl)) {
    errors.imageUrl = "L'URL dell'immagine non è valido";
  }

  if (!['Nuovo', 'Usato Buono Stato', 'Usato', 'Rovinato'].includes(product.state)) {
    errors.state = "Lo stato del prodotto non è valido";
  }

  if (typeof product.isPrototype !== 'boolean') {
    errors.isPrototype = "Il campo Prototipo deve essere un booleano";
  }

  if (typeof product.isForShowroom !== 'boolean') {
    errors.isForShowroom = "Il campo Per Showroom deve essere un booleano";
  }

  return errors;
};

const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    // Verifica che il protocollo sia http o https
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false;
    }
    // Verifica che l'hostname non sia vuoto
    if (!parsedUrl.hostname) {
      return false;
    }
    // Verifica che l'hostname abbia almeno un punto (es. example.com)
    if (!parsedUrl.hostname.includes('.')) {
      return false;
    }
    // Verifica che il TLD (Top Level Domain) sia valido (almeno 2 caratteri)
    const tld = parsedUrl.hostname.split('.').pop();
    if (tld.length < 2) {
      return false;
    }
    // Verifica che l'URL non contenga caratteri non validi
    const invalidChars = /[<>{}|\^~\[\]`]/;
    if (invalidChars.test(url)) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};