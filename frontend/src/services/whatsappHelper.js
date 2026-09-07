// Helper to generate WhatsApp Web / App share links

export const shareSongOnWhatsApp = (song) => {
  if (!song) return;

  const title = song.title || 'Música de Louvor';
  const artist = song.artist || 'Ministério de Louvor';
  const tom = song.keySignature || 'G';
  const bpm = song.bpm ? `${song.bpm} BPM` : '72 BPM';
  const categoria = song.category || 'Geral';
  const pasta = song.folder?.name ? `\n📂 *Pasta / Repertório:* ${song.folder.name}` : '';

  let message = `🎵 *${title.toUpperCase()}* - ${artist}
━━━━━━━━━━━━━━━━━━━
🎼 *Tom:* ${tom}  |  ⏱️ *Andamento:* ${bpm}
🏷️ *Categoria:* ${categoria}${pasta}

`;

  if (song.lyrics && song.lyrics.trim().length > 0) {
    const previewLyrics = song.lyrics.split('\n').slice(0, 6).join('\n');
    message += `📜 *Trecho da Letra:*\n_"${previewLyrics}..."_\n\n`;
  }

  message += `📲 *CantaFlow — by PixelLab*\nGerencie seu repertório, cifras e playbacks: https://cantaflow.pixellab.app`;

  const encoded = encodeURIComponent(message);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
};

export const shareChurchOnWhatsApp = (church) => {
  if (!church) return;

  const nome = church.name;
  const bairro = church.neighborhood;
  const endereco = `${church.address} - ${bairro}, ${church.city} - ${church.state}`;
  const pastor = church.pastor ? `\n👤 *Dirigente / Pastor:* ${church.pastor}` : '';
  const mapsUrl = church.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(church.name + ' ' + endereco)}`;

  let cultosText = '';
  if (church.cultosSchedule && church.cultosSchedule.length > 0) {
    cultosText = '\n\n🗓️ *Horários de Cultos:*\n' + church.cultosSchedule
      .map(c => `• *${c.day} às ${c.time}:* ${c.name}`)
      .join('\n');
  }

  let message = `⛪ *${nome.toUpperCase()}*
📍 *Endereço:* ${endereco}${pastor}${cultosText}

🗺️ *Abrir Rota no Google Maps:*
${mapsUrl}

📲 *Compartilhado via CantaFlow — by PixelLab*
Instagram Oficial: ${church.instagram || 'https://instagram.com/adguaratingueta'}`;

  const encoded = encodeURIComponent(message);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
};

export const shareFolderOnWhatsApp = (folder, songs = []) => {
  if (!folder) return;

  let message = `📁 *REPERTÓRIO: ${folder.name.toUpperCase()}*
📅 *Escala de Louvor — AD Guaratinguetá*
━━━━━━━━━━━━━━━━━━━\n\n`;

  if (songs.length === 0) {
    message += `Nenhuma música adicionada ainda nesta pasta.\n`;
  } else {
    songs.forEach((song, idx) => {
      message += `${idx + 1}. *${song.title}* (${song.artist || 'Louvor'}) — Tom: *${song.keySignature || 'G'}* | ${song.bpm || 70} BPM\n`;
    });
  }

  message += `\n🎧 Ouça e ensaie pelo *CantaFlow — by PixelLab*`;

  const encoded = encodeURIComponent(message);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
};
