export type QuestionCategory = 'truth' | 'dare' | 'trivia' | 'wild';

export interface QuestionCard {
  id: string;
  category: QuestionCategory;
  title: string;
  prompt: string;
  penaltyOrReward?: string;
}

export interface CategoryMeta {
  label: string;
  icon: string;
  badgeBg: string;
  badgeColor: string;
  borderColor: string;
}

export const QUESTION_CATEGORIES: Record<QuestionCategory, CategoryMeta> = {
  truth: {
    label: 'Jujur (Truth)',
    icon: '🤫',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeColor: '#38bdf8',
    borderColor: '#0284c7',
  },
  dare: {
    label: 'Tantangan (Dare)',
    icon: '🔥',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeColor: '#f43f5e',
    borderColor: '#e11d48',
  },
  trivia: {
    label: 'Trivia Santai',
    icon: '💡',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeColor: '#fbbf24',
    borderColor: '#d97706',
  },
  wild: {
    label: 'Aksi Tongkrongan',
    icon: '🎉',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeColor: '#c084fc',
    borderColor: '#9333ea',
  },
};

export const PARTY_QUESTIONS: QuestionCard[] = [
  // --- TRUTH ---
  {
    id: 't1',
    category: 'truth',
    title: 'Si Paling Ngaret',
    prompt: 'Sebutkan dengan jujur: siapa di antara pemain di ruangan ini yang paling sering ngaret kalau ada janji kumpul?',
    penaltyOrReward: 'Jawab jujur atau mundur 2 langkah!',
  },
  {
    id: 't2',
    category: 'truth',
    title: 'Pengeluaran Rahasia',
    prompt: 'Apa barang paling impulsif atau tidak berguna yang pernah kamu beli dalam 3 bulan terakhir?',
    penaltyOrReward: 'Ceritakan harganya juga!',
  },
  {
    id: 't3',
    category: 'truth',
    title: 'Pesan Terakhir',
    prompt: 'Siapa kontak terakhir di aplikasi chat kamu selain keluarga atau urusan kerja? Apa yang kalian bicarakan?',
  },
  {
    id: 't4',
    category: 'truth',
    title: 'Gelar Tongkrongan',
    prompt: 'Kalau kamu harus memberi satu julukan kocak untuk pemain di sebelah kananmu, apa julukannya dan kenapa?',
  },
  {
    id: 't5',
    category: 'truth',
    title: 'Momen Terkocak',
    prompt: 'Ceritakan satu momen paling memalukan yang pernah kamu alami di tempat umum!',
  },
  {
    id: 't6',
    category: 'truth',
    title: 'Kesan Pertama',
    prompt: 'Waktu pertama kali kenal dengan salah satu pemain di sini, apa yang pertama kali kamu pikirkan tentang dia?',
  },

  // --- DARE ---
  {
    id: 'd1',
    category: 'dare',
    title: 'Tiru Suara Hewan',
    prompt: 'Tirukan suara ayam jago berkokok sekencang-kencangnya selama 5 detik!',
    penaltyOrReward: 'Jika menolak, mundur 2 petak!',
  },
  {
    id: 'd2',
    category: 'dare',
    title: 'Tahan Tawa 30 Detik',
    prompt: 'Tatap muka pemain di sebelah kirimu tanpa tersenyum atau tertawa selama 30 detik. Pemain lain boleh mencoba membuatmu tertawa!',
    penaltyOrReward: 'Jika tertawa, mundur 1 petak.',
  },
  {
    id: 'd3',
    category: 'dare',
    title: 'Pujian Puitis',
    prompt: 'Bikin gombalan atau pujian puitis dadakan dan ucapkan dengan penuh penghayatan ke salah satu pemain!',
  },
  {
    id: 'd4',
    category: 'dare',
    title: 'Gaya Patung',
    prompt: 'Pilih pose konyol dan jangan bergerak sama sekali sampai giliran pemain berikutnya selesai melempar dadu!',
  },
  {
    id: 'd5',
    category: 'dare',
    title: 'Nyanyi Reff Lagu',
    prompt: 'Pemain lain berhak menentukan satu judul lagu pop atau dangdut, dan kamu harus menyanyikan reff-nya sekarang juga!',
  },
  {
    id: 'd6',
    category: 'dare',
    title: 'Jalan Model Kucing',
    prompt: 'Berdiri dan peragakan jalan ala catwalk model sejauh 5 langkah dengan gaya paling dramatis!',
  },

  // --- TRIVIA ---
  {
    id: 'tr1',
    category: 'trivia',
    title: 'Tebak Singkatan',
    prompt: 'Apa kepanjangan dari kata "Mager", "Baper", dan "Gaje"? Sebutkan dalam waktu 10 detik!',
    penaltyOrReward: 'Benar: Maju 1 langkah! Salah: Tetap di tempat.',
  },
  {
    id: 'tr2',
    category: 'trivia',
    title: 'Ibukota Nusantara',
    prompt: 'Sebutkan nama Ibukota Negara Indonesia yang baru dan di provinsi mana lokasinya!',
    penaltyOrReward: 'Benar: Maju 1 langkah!',
  },
  {
    id: 'tr3',
    category: 'trivia',
    title: 'Penyanyi Lagu Legendaris',
    prompt: 'Siapa penyanyi lagu legendaris "Separuh Nafas"? Sebutkan nama band-nya dalam 5 detik!',
  },
  {
    id: 'tr4',
    category: 'trivia',
    title: 'Kuliner Nusantara',
    prompt: 'Sebutkan 5 macam makanan khas Indonesia yang berbahan dasar daging dalam waktu 10 detik!',
    penaltyOrReward: 'Gagal sebut 5: Mundur 1 langkah.',
  },
  {
    id: 'tr5',
    category: 'trivia',
    title: 'Pecahan Uang Rupiah',
    prompt: 'Sebutkan pahlawan nasional yang ada pada uang kertas pecahan Rp 50.000 atau Rp 100.000!',
  },

  // --- WILD / AKSI TONGKRONGAN ---
  {
    id: 'w1',
    category: 'wild',
    title: 'Duel Batu Gunting Kertas',
    prompt: 'Tantang pemain dengan posisi paling depan untuk duel Suit (Gunting-Batu-Kertas) satu kali!',
    penaltyOrReward: 'Jika kamu menang: Maju 2 langkah. Jika kalah: Mundur 1 langkah.',
  },
  {
    id: 'w2',
    category: 'wild',
    title: 'Tos Solidaritas',
    prompt: 'Lakukan tos gaya keren (*high five*) dengan setiap pemain di ruangan ini sambil mengucapkan "Solid terus!".',
  },
  {
    id: 'w3',
    category: 'wild',
    title: 'Pesta Rezeki',
    prompt: 'Kartu Keberuntungan! Semua pemain yang posisinya berada di belakangmu berhak maju 1 petak bersama-sama!',
  },
  {
    id: 'w4',
    category: 'wild',
    title: 'Tukar Senyum',
    prompt: 'Berikan senyum paling manis dan acungkan jempol ke semua pemain!',
  },
];

/**
 * Special Climax Challenges exclusively triggered when a player reaches Cell 100 to crown the Winner.
 */
export const FINAL_SHOWDOWN_QUESTIONS: QuestionCard[] = [
  {
    id: 'final-1',
    category: 'wild',
    title: 'Pidato Sang Juara 🏆',
    prompt: 'Berdiri dan sampaikan pidato kemenangan selama 30 detik: Ucapkan terima kasih kepada teman-teman tongkronganmu yang sudah berjuang keras dan harus rela kalah hari ini!',
    penaltyOrReward: 'Wajib diakhiri dengan pose kemenangan paling keren!',
  },
  {
    id: 'final-2',
    category: 'truth',
    title: 'Janji Traktiran Juara ☕',
    prompt: 'Sebagai pemenang Tongkrongan 100, sebutkan satu hal yang rela kamu traktir atau sediakan untuk teman-temanmu di tongkrongan berikutnya (misal: gorengan, kopi, atau camilan)!',
    penaltyOrReward: 'Harus disepakati bersama oleh semua pemain di ruangan!',
  },
  {
    id: 'final-3',
    category: 'dare',
    title: 'Joget Kemenangan 🕺',
    prompt: 'Peragakan joget kemenangan (*victory dance*) khas kamu selama 10 detik di hadapan semua pemain!',
    penaltyOrReward: 'Semua pemain lain wajib memberi tepuk tangan paling meriah!',
  },
  {
    id: 'final-4',
    category: 'truth',
    title: 'Momen Penentu Kemenangan 🎯',
    prompt: 'Ceritakan satu momen paling menegangkan di sepanjang permainan tadi saat kamu merasa paling beruntung atau hampir disalip pemain lain!',
  },
  {
    id: 'final-5',
    category: 'wild',
    title: 'Gelar Kehormatan Teman Seperjuangan 🎖️',
    prompt: 'Berikan satu gelar kehormatan unik kepada setiap pemain yang kamu kalahkan hari ini (misal: "Pawang Ular", "Raja Tangga", "Sultan Kartu")!',
  },
];

/**
 * Returns a random question card, optionally excluding recent cards to prevent repetition.
 */
export function getRandomQuestion(excludeIds: string[] = []): QuestionCard {
  const available = PARTY_QUESTIONS.filter((q) => !excludeIds.includes(q.id));
  const pool = available.length > 0 ? available : PARTY_QUESTIONS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Draws a random final champion challenge when a player reaches Tile 100.
 */
export function getRandomFinalQuestion(): QuestionCard {
  const randomIndex = Math.floor(Math.random() * FINAL_SHOWDOWN_QUESTIONS.length);
  return FINAL_SHOWDOWN_QUESTIONS[randomIndex];
}
