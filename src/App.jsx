import { useState, useRef, useEffect } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CINEYATRA · Personalised for Shalini (@rsshalini)
//  Tamil speaker · Bold · Nostalgic · Analytical · Romantic · Chill
//  Palette: Deep rose-red + blush gold — bold yet warm
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Shalini's personality DNA → drives the "For You" shelf picks
const SHALINI_DNA = {
  topGenres:  ["Thriller","Romance","Drama","Epic","Horror","Martial Arts"],
  topCinemas: ["Indian","Korean","Japanese","Chinese"],
  topMoods:   ["suspense","gripping","romantic","emotional","intense","nostalgic","inspiring"],
  forYouIds:  [8,10,29,32,37,42,6,31,40,11,30,35], // hand-curated shelf
};

// ── MOVIE CORPUS ─────────────────────────────────────────────────────────────
// rt: { t: Tomatometer%, a: Audience% }  |  shalini: true = "For You" shelf pick
const MOVIES = [
  // ══ INDIAN · TAMIL ══
  { id:51, cinema:"Indian", title:"Vikram Vedha",         year:2017, language:["Tamil"],    genre:["Thriller","Crime","Action"],      mood:["suspense","gripping","intense"],          timeSlots:["evening","night"],    audience:["couples","boysgang"],           rt:{t:97,a:96},  shalini:true,  summary:"A relentless cop chases a legendary gangster — only to find his own moral compass shattered with every revelation the criminal reveals. R. Madhavan and Vijay Sethupathi are electrifying in this cat-and-mouse classic. One of Tamil cinema's finest thrillers, with a script that keeps flipping your allegiances.", platforms:["Prime Video","Netflix"],    poster:"⚔️" },
  { id:52, cinema:"Indian", title:"Super Deluxe",         year:2019, language:["Tamil"],    genre:["Drama","Dark Comedy","Thriller"], mood:["thought-provoking","intense","gripping"], timeSlots:["evening","night"],    audience:["couples","boysgang"],           rt:{t:100,a:88}, shalini:true,  summary:"Four wildly different storylines collide in one bizarre, unforgettable night in Tamil Nadu — involving a trans woman, a cheating wife, a vengeful schoolboy, and an apocalyptic believer. Thiagarajan Kumararaja's magnum opus is provocative, funny, heartbreaking, and unlike anything else in Indian cinema. Vijay Sethupathi delivers a career-defining performance.", platforms:["Prime Video"],              poster:"💥" },
  { id:53, cinema:"Indian", title:"96",                   year:2018, language:["Tamil"],    genre:["Romance","Drama"],                mood:["nostalgic","emotional","romantic"],        timeSlots:["evening","night"],    audience:["couples","girlgang"],           rt:{t:null,a:97},shalini:true,  summary:"Two school sweethearts meet after decades apart, and a single night of conversation unfolds a lifetime of unspoken love. Vijay Sethupathi and Trisha are heartbreakingly perfect — their chemistry is pure nostalgia made visible. The most beautiful Tamil romance in years, told almost entirely without melodrama.", platforms:["Prime Video","ZEE5"],       poster:"🌸" },
  { id:54, cinema:"Indian", title:"Kaithi",               year:2019, language:["Tamil"],    genre:["Action","Thriller"],              mood:["intense","gripping","action-packed"],     timeSlots:["evening","night"],    audience:["boysgang","couples"],           rt:{t:null,a:96},shalini:true,  summary:"An ex-convict who has never met his daughter races through a single violent night to reach her — while unknowingly becoming the only hope for a convoy of poisoned policemen. Lokesh Kanagaraj's no-intermission thriller is pure adrenaline from frame one. Karthi has never been better.", platforms:["Prime Video","Disney+ Hotstar"], poster:"🌙" },
  { id:55, cinema:"Indian", title:"Soorarai Pottru",      year:2020, language:["Tamil"],    genre:["Drama","Bio","Inspiring"],        mood:["inspiring","emotional","epic"],           timeSlots:["afternoon","evening","night"], audience:["family","couples"],         rt:{t:97,a:97},  shalini:true,  summary:"The true story of the man who dared to build a low-cost airline for ordinary Indians — fighting the system, the elite, and his own self-doubt. Suriya gives the performance of his career in this thunderous, deeply moving biopic. Won the National Award for Best Film and Best Actor.", platforms:["Prime Video"],              poster:"✈️" },
  { id:56, cinema:"Indian", title:"Asuran",               year:2019, language:["Tamil"],    genre:["Drama","Action","Historical"],    mood:["intense","emotional","thought-provoking"],timeSlots:["evening","night"],    audience:["family","couples","boysgang"],  rt:{t:null,a:96},               summary:"A mild-mannered farmer's suppressed rage erupts to protect his family from caste-driven violence in rural Tamil Nadu. Dhanush is absolutely ferocious in a dual-timeline performance that will shake you. Raw, unflinching, and deeply necessary.", platforms:["Prime Video","Disney+ Hotstar"], poster:"🔥" },
  { id:57, cinema:"Indian", title:"Anbe Sivam",           year:2003, language:["Tamil"],    genre:["Drama","Comedy","Philosophy"],    mood:["feel-good","emotional","nostalgic"],      timeSlots:["afternoon","evening"], audience:["family","couples"],             rt:{t:null,a:97},               summary:"A kind-hearted communist and an entitled ad executive are stranded together and forced to travel across India — and one slowly transforms the other. Kamal Haasan gives perhaps his most humane performance in this deeply philosophical road movie. A film that makes you want to be a better person.", platforms:["YouTube","ZEE5"],          poster:"❤️" },
  { id:58, cinema:"Indian", title:"Roja",                 year:1992, language:["Tamil","Hindi"], genre:["Romance","Drama","Thriller"], mood:["romantic","emotional","intense"],        timeSlots:["afternoon","evening","night"], audience:["couples","girlgang"],       rt:{t:null,a:96},               summary:"A newlywed woman's husband is kidnapped by militants in Kashmir and she fights alone — through bureaucracy and heartbreak — to bring him home. Mani Ratnam's masterpiece introduced A.R. Rahman to the world. The music alone will crack your heart open.", platforms:["Prime Video","ZEE5"],       poster:"🌹" },
  { id:59, cinema:"Indian", title:"Kannathil Muthamittal", year:2002, language:["Tamil"],   genre:["Drama","Family","War"],           mood:["emotional","epic","family"],              timeSlots:["afternoon","evening"], audience:["family","couples"],             rt:{t:null,a:95},               summary:"An adopted Tamil girl searches for her birth mother in war-torn Sri Lanka, with her loving parents by her side. Mani Ratnam's most tender film is a meditation on love, identity, and the cost of conflict. P.S. Keerthana's performance will absolutely destroy you.", platforms:["Prime Video"],              poster:"🕊️" },
  { id:60, cinema:"Indian", title:"Mersal",               year:2017, language:["Tamil"],    genre:["Action","Drama","Thriller"],      mood:["epic","intense","inspiring"],             timeSlots:["evening","night"],    audience:["family","boysgang","couples"],  rt:{t:null,a:91},               summary:"A magician with a secret identity seeks vengeance against a corrupt doctor who destroyed his family — across two timelines. Vijay in triple roles is backed by an A.R. Rahman score and Atlee's crowd-pleasing masala direction. A full-blown theatrical experience.", platforms:["Disney+ Hotstar","ZEE5"],   poster:"🎩" },

  // ══ INDIAN · HINDI/OTHER ══
  { id:1,  cinema:"Indian", title:"Dangal",               year:2016, language:["Hindi"],    genre:["Drama","Sports","Bio"],           mood:["inspiring","family","emotional"],         timeSlots:["afternoon","evening","night"], audience:["family","girlgang"],        rt:{t:82,a:88},               summary:"A determined father trains his daughters to become world-class wrestlers against all social odds. Based on the true story of Mahavir Singh Phogat, a powerful tale of ambition and female empowerment. Aamir Khan delivers one of his most celebrated performances.", platforms:["Netflix","Disney+ Hotstar","Prime Video"], poster:"🤼" },
  { id:6,  cinema:"Indian", title:"RRR",                  year:2022, language:["Telugu","Tamil","Hindi","Malayalam","Kannada"], genre:["Action","Historical"], mood:["epic","action-packed","fun"], timeSlots:["evening","night"], audience:["boysgang","couples","family"], rt:{t:96,a:94}, shalini:true, summary:"Two legendary Indian revolutionaries forge an unexpected friendship in 1920s colonial Delhi before destiny tears them apart. S.S. Rajamouli's jaw-dropping spectacle blends mythology, brotherhood, and breathtaking action. A global sensation that made the whole world dance to Naatu Naatu.", platforms:["Netflix","Prime Video","ZEE5"], poster:"🔥" },
  { id:7,  cinema:"Indian", title:"Baahubali: The Beginning", year:2015, language:["Telugu","Tamil","Hindi","Malayalam"], genre:["Action","Fantasy","Epic"], mood:["epic","action-packed","adventure"], timeSlots:["afternoon","evening","night"], audience:["family","boysgang","couples"], rt:{t:90,a:91}, shalini:true, summary:"A young man raised by tribal people discovers his royal lineage and embarks on a quest to reclaim his kingdom. S.S. Rajamouli reimagined Indian cinema with a scale rivalling Hollywood. The cliffhanger ending left an entire nation desperate for Part 2.", platforms:["Netflix","Prime Video","Disney+ Hotstar"], poster:"⚔️" },
  { id:8,  cinema:"Indian", title:"Drishyam",             year:2013, language:["Malayalam","Hindi","Telugu","Tamil","Kannada"], genre:["Thriller","Crime","Drama"], mood:["suspense","gripping","intense"], timeSlots:["night","evening"], audience:["couples","family","boysgang"], rt:{t:null,a:96}, shalini:true, summary:"A cable operator uses his obsessive love of cinema to construct the perfect alibi and shield his family from a murder investigation. Mohanlal's restrained performance anchors one of the most perfectly plotted thrillers in Indian cinema. The climax will make you rewatch every scene from the start.", platforms:["Prime Video","Disney+ Hotstar","Netflix"], poster:"🔍" },
  { id:10, cinema:"Indian", title:"Andhadhun",            year:2018, language:["Hindi"],    genre:["Thriller","Dark Comedy","Crime"], mood:["suspense","gripping","intense"],          timeSlots:["night","evening"],    audience:["couples","boysgang"],           rt:{t:90,a:94}, shalini:true,  summary:"A seemingly blind pianist witnesses a murder and gets pulled into a darkly comic spiral of deceit, betrayal and survival. Sriram Raghavan's genre masterclass is relentless and wickedly unpredictable. Tabu steals every scene as the terrifyingly calculating villain.", platforms:["Netflix","Prime Video"],    poster:"🎹" },
  { id:11, cinema:"Indian", title:"Queen",                year:2014, language:["Hindi"],    genre:["Drama","Romance"],                mood:["inspiring","feel-good","emotional"],      timeSlots:["afternoon","evening","night"], audience:["girlgang","couples"],       rt:{t:90,a:91}, shalini:true,  summary:"A shy Delhi girl goes on her honeymoon alone after her fiancé calls it off, and discovers herself across Paris and Amsterdam. Kangana Ranaut delivers a career-defining performance in this joyful feminist coming-of-age story. A film that will make you want to travel — and trust yourself.", platforms:["Netflix","Prime Video"],    poster:"👸" },
  { id:12, cinema:"Indian", title:"The Lunchbox",         year:2013, language:["Hindi"],    genre:["Drama","Romance"],                mood:["romantic","emotional","quiet"],           timeSlots:["afternoon","evening"], audience:["couples","girlgang"],           rt:{t:96,a:87},               summary:"A mistaken lunchbox delivery connects a lonely housewife and a widowed accountant, sparking an unlikely written correspondence. Irrfan Khan and Nimrat Kaur generate extraordinary chemistry without ever sharing a scene. A gentle, beautiful film about longing and connection in the noise of Mumbai.", platforms:["Netflix","Prime Video"],    poster:"🍱" },
  { id:14, cinema:"Indian", title:"K.G.F: Chapter 1",     year:2018, language:["Kannada","Hindi","Telugu","Tamil","Malayalam"], genre:["Action","Crime","Epic"], mood:["intense","epic","action-packed"], timeSlots:["evening","night"], audience:["boysgang","couples"], rt:{t:null,a:94}, summary:"A ruthless young man rises from poverty to become the most feared overlord of a gold mining empire in 1970s India. Yash commands every frame with godlike charisma. The style is pure maximalism — gritty, operatic, and utterly compelling.", platforms:["Prime Video","Netflix","ZEE5"], poster:"💰" },
  { id:16, cinema:"Indian", title:"Article 15",           year:2019, language:["Hindi"],    genre:["Crime","Drama","Thriller"],       mood:["intense","thought-provoking","gripping"], timeSlots:["evening","night"],    audience:["couples","girlgang","boysgang"],rt:{t:89,a:88},               summary:"An idealistic IPS officer investigates the murder of two Dalit girls in rural UP, uncovering systemic caste discrimination. Ayushmann Khurrana's understated performance anchors this unflinching, necessary film. One of the most important Indian films of its decade.", platforms:["Disney+ Hotstar","Prime Video"], poster:"⚖️" },
  { id:2,  cinema:"Indian", title:"3 Idiots",             year:2009, language:["Hindi"],    genre:["Comedy","Drama"],                 mood:["fun","inspiring","lighthearted"],         timeSlots:["morning","afternoon","evening","night"], audience:["family","boysgang","girlgang"], rt:{t:100,a:96}, summary:"Three engineering students navigate the pressure-cooker world of India's top college while questioning the purpose of education. Aamir Khan, R. Madhavan, and Sharman Joshi are an unforgettable trio. A heartwarming comedy that will make you laugh, cry, and rethink everything.", platforms:["Netflix","YouTube Premium"], poster:"🎓" },
  { id:5,  cinema:"Indian", title:"Dil Chahta Hai",       year:2001, language:["Hindi"],    genre:["Comedy","Drama","Romance"],       mood:["fun","lighthearted","nostalgic"],         timeSlots:["afternoon","evening","night"], audience:["couples","boysgang","girlgang"], rt:{t:100,a:93}, summary:"Three best friends navigate the choppy waters of love, friendship, and growing up after college. It redefined how Bollywood portrayed friendship and modernity. Fresh, witty, and effortlessly cool — it holds up brilliantly two decades later.", platforms:["Netflix","Prime Video"], poster:"🎉" },
  { id:19, cinema:"Indian", title:"Piku",                 year:2015, language:["Hindi"],    genre:["Comedy","Drama"],                 mood:["feel-good","fun","character-driven"],     timeSlots:["afternoon","evening"], audience:["family","girlgang","couples"],   rt:{t:91,a:87},               summary:"A strong-willed architect juggles her demanding hypochondriac father and a road trip from Delhi to Kolkata. Deepika Padukone, Amitabh Bachchan, and Irrfan Khan make this quirky slice-of-life film an absolute delight. Warm, witty, and wonderfully alive.", platforms:["Prime Video","Netflix"],    poster:"🚗" },
  { id:9,  cinema:"Indian", title:"Kumbalangi Nights",    year:2019, language:["Malayalam"], genre:["Drama","Romance","Family"],      mood:["feel-good","emotional","romantic"],        timeSlots:["evening","night"],    audience:["couples","girlgang"],           rt:{t:null,a:95},             summary:"Four dysfunctional brothers in a coastal Kerala village slowly learn to coexist and love. A quietly brilliant film that subverts toxic masculinity with warmth, humor, and extraordinary performances. One of the finest Malayalam films of the decade.", platforms:["Prime Video"], poster:"🌊" },

  // ══ HOLLYWOOD ══
  { id:20, cinema:"Hollywood", title:"Gone Girl",         year:2014, language:["English"],  genre:["Thriller","Mystery","Drama"],     mood:["suspense","gripping","intense"],          timeSlots:["evening","night"],    audience:["couples","girlgang"],           rt:{t:87,a:84}, shalini:true,  summary:"When a woman goes missing on her anniversary, her charming husband becomes the prime suspect — but nothing is what it seems. David Fincher's psychological thriller is a razor-sharp, darkly funny dismantling of marriage, media, and performance. Rosamund Pike is absolutely chilling.", platforms:["Max","Prime Video"],        poster:"🎭" },
  { id:21, cinema:"Hollywood", title:"Inception",         year:2010, language:["English"],  genre:["Sci-Fi","Thriller","Action"],     mood:["intense","gripping","epic"],              timeSlots:["evening","night"],    audience:["boysgang","couples"],           rt:{t:87,a:91},               summary:"A thief who enters the subconscious of his targets is offered one last chance at redemption — if he can plant an idea inside a powerful man's mind. Christopher Nolan's labyrinthine blockbuster rewards analytical minds who love to pick apart every layer. That spinning top at the end will haunt you.", platforms:["Netflix","Max","Prime Video"], poster:"🌀" },
  { id:22, cinema:"Hollywood", title:"The Dark Knight",   year:2008, language:["English"],  genre:["Action","Thriller","Crime"],      mood:["intense","gripping","epic"],              timeSlots:["evening","night"],    audience:["boysgang","couples","family"],  rt:{t:94,a:94},               summary:"Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy. Christopher Nolan's superhero film transcended the genre to become a riveting crime epic. Heath Ledger's Joker is one of cinema's all-time greatest villain performances.", platforms:["Max","Prime Video","Apple TV+"], poster:"🦇" },
  { id:23, cinema:"Hollywood", title:"Crazy Rich Asians", year:2018, language:["English"],  genre:["Romance","Comedy"],               mood:["fun","romantic","feel-good"],             timeSlots:["afternoon","evening","night"], audience:["girlgang","couples"],       rt:{t:91,a:79}, shalini:true,  summary:"A Chinese-American economics professor is blindsided to discover her boyfriend is one of Singapore's most eligible — and absurdly wealthy — bachelors, and must win over his ice-queen mother. A lush, funny, emotional celebration of Asian culture wrapped in a gorgeous romance. Perfect girls-night watch.", platforms:["Max","Netflix"],             poster:"💍" },
  { id:24, cinema:"Hollywood", title:"Knives Out",        year:2019, language:["English"],  genre:["Thriller","Mystery","Comedy"],    mood:["suspense","gripping","fun"],              timeSlots:["evening","night"],    audience:["couples","girlgang","family"],  rt:{t:97,a:92}, shalini:true,  summary:"When a famous crime novelist is found dead, a brilliant detective investigates a household full of suspects — each with a motive and a secret. Rian Johnson's crowd-pleasing whodunit subverts every Agatha Christie trope while making you grin. Perfect for the analytical mind that loves to solve things before the reveal.", platforms:["Prime Video","Netflix"],    poster:"🔪" },
  { id:25, cinema:"Hollywood", title:"Whiplash",          year:2014, language:["English"],  genre:["Drama","Music"],                  mood:["intense","inspiring","gripping"],         timeSlots:["evening","night"],    audience:["boysgang","couples"],           rt:{t:94,a:95},               summary:"An ambitious young drummer enrolls at a top music conservatory under a fearsomely demanding instructor. Damien Chazelle's film is a visceral, terrifying exploration of greatness and the cost of obsession. J.K. Simmons won the Oscar — and earned every single vote.", platforms:["Netflix","Prime Video"],    poster:"🥁" },
  { id:26, cinema:"Hollywood", title:"Pride & Prejudice", year:2005, language:["English"],  genre:["Romance","Drama"],                mood:["romantic","feel-good","nostalgic"],       timeSlots:["afternoon","evening"], audience:["girlgang","couples"],           rt:{t:87,a:93}, shalini:true,  summary:"The timeless story of Elizabeth Bennet and Mr. Darcy — pride, prejudice, and the slow burn of a love neither expected. Keira Knightley and Matthew Macfadyen are perfect in this luminous, rain-soaked adaptation. Absolutely essential for anyone who believes in slow romantic tension.", platforms:["Netflix","Prime Video","Peacock"], poster:"🌧️" },
  { id:27, cinema:"Hollywood", title:"Good Will Hunting",  year:1997, language:["English"], genre:["Drama","Romance"],                mood:["emotional","inspiring","character-driven"],timeSlots:["evening","night"],   audience:["couples","girlgang","boysgang"],rt:{t:97,a:95},               summary:"A janitor at MIT secretly a mathematical genius must choose between his working-class world or seizing an extraordinary life. Matt Damon and Ben Affleck's Oscar-winning script crackles with wit and warmth. Robin Williams is heartbreaking as the therapist who finally breaks through.", platforms:["Netflix","Prime Video","Max"], poster:"📐" },
  { id:28, cinema:"Hollywood", title:"Interstellar",      year:2014, language:["English"],  genre:["Sci-Fi","Drama","Epic"],          mood:["epic","emotional","thought-provoking"],   timeSlots:["afternoon","evening","night"], audience:["family","boysgang","couples"], rt:{t:73,a:86}, shalini:true, summary:"A team of astronauts travel through a wormhole near Saturn in search of a new home for humanity. Christopher Nolan crafts a grandly ambitious film about love, time, and sacrifice that rewards analytical viewers. Hans Zimmer's thunderous organ score will rattle your soul.", platforms:["Netflix","Prime Video","Max"], poster:"🚀" },

  // ══ KOREAN ══
  { id:29, cinema:"Korean",  title:"Parasite",            year:2019, language:["Korean"],   genre:["Thriller","Drama","Dark Comedy"], mood:["suspense","gripping","thought-provoking"], timeSlots:["evening","night"],  audience:["boysgang","couples"],           rt:{t:99,a:90}, shalini:true,  summary:"A destitute Korean family schemes its way into the employment of a wealthy household, with darkly comedic and violent consequences. Bong Joon-ho's Palme d'Or and Best Picture Oscar winner is a razor-sharp dissection of class inequality. Nothing prepares you for where the second half goes.", platforms:["Max","Prime Video","Peacock"], poster:"🪲" },
  { id:30, cinema:"Korean",  title:"Oldboy",              year:2003, language:["Korean"],   genre:["Thriller","Mystery","Action"],    mood:["suspense","intense","gripping"],           timeSlots:["night"],             audience:["boysgang","couples"],           rt:{t:80,a:88}, shalini:true,  summary:"A man imprisoned without explanation for 15 years is abruptly freed and given five days to unravel who jailed him and why. Park Chan-wook's Vengeance Trilogy entry is a hallucinatory revenge masterpiece with one of cinema's most shocking twists. The corridor fight is pure choreographic genius.", platforms:["Max","Tubi"],               poster:"🔨" },
  { id:31, cinema:"Korean",  title:"Train to Busan",      year:2016, language:["Korean"],   genre:["Horror","Action","Drama"],        mood:["intense","action-packed","emotional"],    timeSlots:["evening","night"],    audience:["boysgang","couples","family"],  rt:{t:97,a:87}, shalini:true,  summary:"A workaholic father tries to protect his daughter during a zombie apocalypse that sweeps through a speeding Korean train. Yeon Sang-ho uses horror as a vehicle for class commentary and parental guilt. The emotional gut-punch in the final act is devastating.", platforms:["Netflix","Shudder","Max"],  poster:"🚇" },
  { id:32, cinema:"Korean",  title:"Memories of Murder",  year:2003, language:["Korean"],   genre:["Crime","Thriller","Drama"],       mood:["suspense","gripping","thought-provoking"], timeSlots:["evening","night"],  audience:["boysgang","couples"],           rt:{t:95,a:89}, shalini:true,  summary:"Based on South Korea's first serial murders, two detectives with opposite methods pursue an elusive killer in a rural town. Bong Joon-ho's breakthrough film is haunting, funny, and devastating in equal measure. The final shot is one of the most powerful in modern cinema.", platforms:["Max","Mubi"],               poster:"🕵️" },
  { id:33, cinema:"Korean",  title:"My Sassy Girl",       year:2001, language:["Korean"],   genre:["Romance","Comedy"],               mood:["fun","romantic","nostalgic"],             timeSlots:["afternoon","evening"], audience:["couples","girlgang"],           rt:{t:70,a:90},               summary:"A mild-mannered college student meets an unpredictable, eccentric girl on the subway and gets swept into her chaotic orbit. The quintessential Korean rom-com that inspired countless imitators across Asia. Cha Tae-hyun and Jun Ji-hyun have legendary on-screen chemistry.", platforms:["Tubi","Mubi"],             poster:"💃" },
  { id:34, cinema:"Korean",  title:"A Taxi Driver",       year:2017, language:["Korean"],   genre:["Drama","Historical","Action"],    mood:["inspiring","emotional","intense"],        timeSlots:["afternoon","evening","night"], audience:["family","boysgang","couples"], rt:{t:96,a:94}, summary:"A Seoul taxi driver unwittingly becomes a key witness to the 1980 Gwangju Uprising when he ferries a German journalist into the besieged city. Song Kang-ho is extraordinary in this true story of ordinary courage. A deeply moving tribute to a forgotten chapter of history.", platforms:["Netflix","Max"],            poster:"🚕" },
  { id:61, cinema:"Korean",  title:"A Tale of Two Sisters",year:2003, language:["Korean"],  genre:["Horror","Psychological","Drama"], mood:["suspense","intense","gripping"],           timeSlots:["night"],             audience:["couples","boysgang"],           rt:{t:83,a:81}, shalini:true,  summary:"Two sisters return home from a psychiatric hospital to a cold stepmother and a house that seems to hold a terrible secret. Kim Jee-woon's visually stunning psychological horror is one of the most beautifully shot fright films ever made. The kind of ending that demands an immediate rewatch.", platforms:["Mubi","Tubi"],             poster:"🌀" },
  { id:62, cinema:"Korean",  title:"The Handmaiden",      year:2016, language:["Korean"],   genre:["Thriller","Romance","Drama"],     mood:["suspense","gripping","intense"],           timeSlots:["night","evening"],    audience:["couples","girlgang"],           rt:{t:94,a:87}, shalini:true,  summary:"A conwoman hired to seduce a Japanese heiress finds herself drawn to her mark in an elaborate web of deception and desire. Park Chan-wook's lush, erotic thriller is structured like a Russian doll — each act reframes everything before it. Audacious, gorgeous, and completely unforgettable.", platforms:["Mubi","Max"],               poster:"🪭" },

  // ══ JAPANESE ══
  { id:35, cinema:"Japanese", title:"Spirited Away",      year:2001, language:["Japanese"], genre:["Animation","Fantasy","Adventure"],mood:["adventure","family","feel-good"],         timeSlots:["morning","afternoon","evening"], audience:["family","kids","couples","girlgang"], rt:{t:97,a:96}, summary:"A 10-year-old girl wanders into a spirit world and must work in a magical bathhouse to free her parents. Hayao Miyazaki's Oscar-winning masterpiece is a dazzlingly inventive, deeply humane fairy tale. Still the highest-grossing Japanese film ever made.", platforms:["Max","Netflix"], poster:"🌊" },
  { id:36, cinema:"Japanese", title:"Your Name",          year:2016, language:["Japanese"], genre:["Animation","Romance","Sci-Fi"],   mood:["romantic","emotional","nostalgic"],       timeSlots:["afternoon","evening","night"], audience:["couples","girlgang","family"],   rt:{t:97,a:96}, shalini:true, summary:"A teenage girl in rural Japan and a teenage boy in Tokyo mysteriously begin switching bodies, falling in love across time and distance. Makoto Shinkai's visually breathtaking film broke every animation box-office record. The moment the timeline shifts will leave you absolutely breathless.", platforms:["Netflix","Max","Crunchyroll"], poster:"⭐" },
  { id:37, cinema:"Japanese", title:"Grave of the Fireflies", year:1988, language:["Japanese"], genre:["Drama","War","Animation"], mood:["emotional","intense","thought-provoking"], timeSlots:["evening","night"], audience:["family","couples"], rt:{t:100,a:95}, shalini:true, summary:"A teenage boy and his young sister struggle to survive in Japan during the final months of World War II. Isao Takahata's Studio Ghibli masterpiece is one of cinema's most devastating anti-war statements. Roger Ebert called it one of the greatest war films ever made.", platforms:["Max","Mubi"], poster:"🕯️" },
  { id:63, cinema:"Japanese", title:"Ringu",              year:1998, language:["Japanese"], genre:["Horror","Thriller","Mystery"],    mood:["suspense","intense","gripping"],           timeSlots:["night"],             audience:["couples","boysgang"],           rt:{t:97,a:79}, shalini:true,  summary:"A journalist investigates a cursed videotape that kills everyone who watches it — exactly seven days later. Hideo Nakata's J-horror original is still the most chillingly effective horror film to emerge from Japan. The well scene remains one of cinema's great nightmare images.", platforms:["Tubi","Peacock"],           poster:"📺" },
  { id:64, cinema:"Japanese", title:"Ju-On: The Grudge",  year:2002, language:["Japanese"], genre:["Horror","Thriller"],              mood:["suspense","intense"],                      timeSlots:["night"],             audience:["boysgang","couples"],           rt:{t:72,a:72}, shalini:true,  summary:"A malevolent curse born of a violent death haunts all who encounter the house where it happened — spreading like a supernatural contagion. Takashi Shimizu's J-horror classic operates on pure dread rather than jump scares. That croaking sound will follow you to bed.", platforms:["Tubi","Shudder"],           poster:"👁️" },
  { id:38, cinema:"Japanese", title:"Akira",              year:1988, language:["Japanese"], genre:["Animation","Sci-Fi","Action"],    mood:["intense","epic","action-packed"],         timeSlots:["evening","night"],    audience:["boysgang","couples"],           rt:{t:90,a:94},               summary:"In post-apocalyptic Neo-Tokyo, a biker gang member struggles to save his childhood friend transformed by psychic powers. Katsuhiro Otomo's cyberpunk epic redefined what animation could achieve. Its influence on global sci-fi and anime culture is immeasurable.", platforms:["Max","Tubi","Mubi"],       poster:"🏍️" },

  // ══ CHINESE ══
  { id:40, cinema:"Chinese",  title:"Crouching Tiger, Hidden Dragon", year:2000, language:["Mandarin"], genre:["Action","Romance","Drama"], mood:["epic","romantic","inspiring"], timeSlots:["afternoon","evening","night"], audience:["couples","boysgang","girlgang","family"], rt:{t:97,a:86}, shalini:true, summary:"Two warriors in pursuit of a stolen sword find themselves entangled in a love story that defies the laws of physics. Ang Lee's wuxia masterpiece brought Chinese martial arts cinema to global audiences with Oscar-winning grace. The bamboo forest fight is one of cinema's most beautiful action sequences.", platforms:["Netflix","Max"], poster:"🐉" },
  { id:41, cinema:"Chinese",  title:"Hero",               year:2002, language:["Mandarin"], genre:["Action","Drama","Historical"],    mood:["epic","intense","inspiring"],             timeSlots:["afternoon","evening","night"], audience:["boysgang","couples","family"], rt:{t:95,a:80}, shalini:true, summary:"An unnamed warrior tells the emperor the story of how he defeated three legendary assassins — but each retelling reveals a different truth. Zhang Yimou's visual poem uses color as narrative language, each chapter bathed in a different palette. Breathtakingly gorgeous and philosophically rich.", platforms:["Max","Tubi","Mubi"], poster:"🏯" },
  { id:42, cinema:"Chinese",  title:"Ip Man",             year:2008, language:["Cantonese","Mandarin"], genre:["Action","Drama","Bio"], mood:["inspiring","epic","intense"], timeSlots:["afternoon","evening","night"], audience:["boysgang","family","couples"], rt:{t:78,a:92}, shalini:true, summary:"The legendary Wing Chun grandmaster and teacher of Bruce Lee struggles to protect his family and city during the Japanese occupation of Foshan. Donnie Yen's performance and the combat choreography are equally extraordinary. A martial arts film with genuine emotional weight.", platforms:["Netflix","Max"], poster:"🥋" },
  { id:43, cinema:"Chinese",  title:"Farewell My Concubine", year:1993, language:["Mandarin"], genre:["Drama","Historical","Romance"], mood:["emotional","epic","intense"], timeSlots:["evening","night"], audience:["couples","girlgang"], rt:{t:97,a:91}, summary:"Two Peking Opera performers navigate a friendship spanning five turbulent decades of Chinese history — from warlords to the Cultural Revolution. Chen Kaige's Palme d'Or winner is a staggeringly ambitious epic about art, identity, and loyalty. Leslie Cheung is heartbreaking.", platforms:["Mubi","Criterion Channel"], poster:"🎭" },
  { id:44, cinema:"Chinese",  title:"Raise the Red Lantern", year:1991, language:["Mandarin"], genre:["Drama","Thriller"], mood:["intense","thought-provoking","gripping"], timeSlots:["evening","night"], audience:["couples","girlgang"], rt:{t:100,a:91}, summary:"A young woman in 1920s China becomes the fourth wife of a wealthy lord, discovering the bitter rituals and jealousies of compound life. Zhang Yimou's visually stunning film is a powerful allegory about patriarchy and female oppression. Every frame is a painting.", platforms:["Criterion Channel","Mubi"], poster:"🏮" },
  { id:65, cinema:"Chinese",  title:"The House of Flying Daggers", year:2004, language:["Mandarin"], genre:["Action","Romance","Drama"], mood:["romantic","epic","intense"], timeSlots:["afternoon","evening","night"], audience:["couples","girlgang","boysgang"], rt:{t:86,a:82}, shalini:true, summary:"A blind dancer and two rival officers navigate a deadly web of love, loyalty, and betrayal in Tang Dynasty China. Zhang Yimou's visually ravishing action romance is as much a love story as a fight film. The bamboo forest and echo sequence are breathtaking cinema.", platforms:["Max","Tubi"], poster:"🌸" },
];

// ── SHALINI'S "FOR YOU" SHELF ─────────────────────────────────────────────────
const FOR_YOU = MOVIES.filter(m => m.shalini);

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const CINEMAS     = ["All","Indian","Hollywood","Korean","Japanese","Chinese"];
const CINEMA_FLAGS = { Indian:"🇮🇳", Hollywood:"🎬", Korean:"🇰🇷", Japanese:"🇯🇵", Chinese:"🇨🇳" };
const CINEMA_COLORS= { Indian:"#c0415a", Hollywood:"#7c55d4", Korean:"#d44060", Japanese:"#d45040", Chinese:"#c06030" };

// Shalini's palette: Deep crimson rose as primary, shifts per cinema
const SHALINI_PRIMARY = "#c0415a"; // bold rose-red

const LANGS_BY_CINEMA = {
  Indian:["All","Tamil","Hindi","Telugu","Malayalam","Kannada"],
  Hollywood:["All","English"],
  Korean:["All","Korean"],
  Japanese:["All","Japanese"],
  Chinese:["All","Mandarin","Cantonese"],
};

const AUDIENCE_OPTIONS = [
  { key:"solo",     label:"Just Me",   emoji:"🍿",   desc:"Solo + snacks" },
  { key:"couples",  label:"Husband",   emoji:"💑",   desc:"Date night" },
  { key:"girlgang", label:"Girls Night",emoji:"👯‍♀️", desc:"with the gang" },
  { key:"family",   label:"Family",    emoji:"👨‍👩‍👧", desc:"All together" },
  { key:"boysgang", label:"Squad",     emoji:"🤜🤛", desc:"Everyone out" },
];

// Mood presets — Shalini's fingerprint
const SHALINI_MOODS = [
  { key:"thrilled",  label:"🔪 Thrill me",      tags:["suspense","gripping","intense"],       desc:"Thrillers · Crime" },
  { key:"romantic",  label:"🌸 Romance me",     tags:["romantic","feel-good","nostalgic"],    desc:"Rom-coms · Love stories" },
  { key:"emotional", label:"💔 Let me cry",     tags:["emotional","thought-provoking"],       desc:"Heavy drama" },
  { key:"epic",      label:"⚔️ Epic night",     tags:["epic","action-packed","inspiring"],    desc:"Big-screen energy" },
  { key:"horror",    label:"👁️ Scare me",       tags:["suspense","intense"],                  genre:"Horror" },
  { key:"chill",     label:"☕ Chill evening",  tags:["feel-good","lighthearted","nostalgic"],desc:"Easy watching" },
];

const TIME_SLOTS = ["morning","afternoon","evening","night"];
function getTimeSlot(h){if(h>=5&&h<12)return"morning";if(h>=12&&h<17)return"afternoon";if(h>=17&&h<21)return"evening";return"night";}
function getTimeEmoji(s){return{morning:"🌅",afternoon:"☀️",evening:"🌆",night:"🌙"}[s]||"🎬";}
function shuffle(arr,n){return[...arr].sort(()=>Math.random()-0.5).slice(0,n);}

function filterMovies(slot,cinema,lang,audience,moodEntry){
  let pool=MOVIES.filter(m=>{
    const ci=cinema==="All"||m.cinema===cinema;
    const la=lang==="All"||m.language.includes(lang);
    const au=!audience||audience==="solo"||m.audience.includes(audience);
    const slotOk=m.timeSlots.includes(slot);
    const moodOk=!moodEntry||m.mood.some(x=>moodEntry.tags.includes(x))||(moodEntry.genre&&m.genre.includes(moodEntry.genre));
    return ci&&la&&au&&(slotOk||moodOk);
  });
  if(pool.length<3)pool=MOVIES.filter(m=>(cinema==="All"||m.cinema===cinema)&&(lang==="All"||m.language.includes(lang)));
  if(pool.length<3)pool=MOVIES;
  // boost high-rated films (Shalini's preference)
  pool.sort((a,b)=>((b.rt.t||b.rt.a||0)-(a.rt.t||a.rt.a||0)));
  return shuffle(pool.slice(0,Math.max(pool.length,6)),3);
}

function promptSearch(text,cinema,lang){
  const low=text.toLowerCase();
  let base=MOVIES.filter(m=>(cinema==="All"||m.cinema===cinema)&&(lang==="All"||m.language.includes(lang)));
  const scored=base.map(m=>{
    let sc=0;
    const all=[...m.genre,...m.mood,...m.language,...m.audience,m.title,m.cinema].join(" ").toLowerCase();
    ["thriller","action","romance","drama","horror","comedy","epic","historical","animation","mystery","war","crime","suspense","nostalgic","emotional","inspiring","romantic","intense"].forEach(kw=>{if(low.includes(kw)&&all.includes(kw))sc+=3;});
    if((low.includes("tamil")||low.includes("indian"))&&m.language.includes("Tamil"))sc+=6;
    if((low.includes("korean")||low.includes("korea"))&&m.cinema==="Korean")sc+=5;
    if((low.includes("japanese")||low.includes("anime")||low.includes("japan"))&&m.cinema==="Japanese")sc+=5;
    if((low.includes("chinese")||low.includes("martial")||low.includes("wuxia"))&&m.cinema==="Chinese")sc+=5;
    if((low.includes("husband")||low.includes("date")||low.includes("couple")||low.includes("romantic"))&&m.audience.includes("couples"))sc+=4;
    if((low.includes("girl")||low.includes("ladies")||low.includes("bestie"))&&m.audience.includes("girlgang"))sc+=4;
    if((low.includes("cry")||low.includes("sad")||low.includes("emotional"))&&m.mood.some(x=>["emotional","thought-provoking"].includes(x)))sc+=4;
    if((low.includes("scare")||low.includes("horror")||low.includes("scary"))&&m.genre.includes("Horror"))sc+=5;
    if((low.includes("laugh")||low.includes("funny")||low.includes("light"))&&m.genre.includes("Comedy"))sc+=4;
    if(low.includes(m.title.toLowerCase()))sc+=12;
    // Shalini boost for her top genres
    if(m.shalini)sc+=2;
    return{...m,sc};
  }).sort((a,b)=>b.sc-a.sc);
  const top=scored.filter(m=>m.sc>0).slice(0,3);
  return top.length>=3?top:shuffle(base,3);
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
async function loadStats(){try{const r=await window.storage.get("cy:stats2",true);return r?JSON.parse(r.value):{totalViews:0,countries:{},cinemas:{},searches:0,lastUpdated:null};}catch{return{totalViews:0,countries:{},cinemas:{},searches:0,lastUpdated:null};}}
async function saveStats(s){try{await window.storage.set("cy:stats2",JSON.stringify(s),true);}catch{}}
async function trackVisit(name,code){const s=await loadStats();s.totalViews=(s.totalViews||0)+1;const k=`${code}|${name}`;s.countries[k]=(s.countries[k]||0)+1;s.lastUpdated=new Date().toISOString();await saveStats(s);}
async function trackSearch(cinema){const s=await loadStats();s.searches=(s.searches||0)+1;if(cinema&&cinema!=="All")s.cinemas[cinema]=(s.cinemas[cinema]||0)+1;await saveStats(s);}
function getFlagEmoji(code){if(!code||code.length!==2)return"🌍";const c=code.toUpperCase();return String.fromCodePoint(...[...c].map(ch=>0x1F1E6-65+ch.charCodeAt(0)));}

// ── RT BADGE ──────────────────────────────────────────────────────────────────
function RTBadge({rt}){
  if(!rt.t&&!rt.a)return<span style={{fontSize:9,color:"#555",fontFamily:"sans-serif"}}>RT N/A</span>;
  return(
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
      {rt.t!=null&&<span style={{padding:"2px 7px",borderRadius:10,fontSize:10,fontFamily:"sans-serif",fontWeight:600,color:"#fff",background:rt.t>=80?"#1e5c18":"#5c1e1e",border:`1px solid ${rt.t>=80?"#3a9a28":"#9a3a28"}`}}>🍅 {rt.t}%</span>}
      {rt.a!=null&&<span style={{padding:"2px 7px",borderRadius:10,fontSize:10,fontFamily:"sans-serif",fontWeight:600,color:"#fff",background:"#18285c",border:"1px solid #3a5aae"}}>🍿 {rt.a}%</span>}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const now=useRef(new Date());
  const h=now.current.getHours(),d=now.current.getDay();
  const [slot,setSlot]=useState(getTimeSlot(h));
  const [cinema,setCinema]=useState("All");
  const [lang,setLang]=useState("All");
  const [audience,setAudience]=useState(null);
  const [selectedMood,setSelectedMood]=useState(null);
  const [mainTab,setMainTab]=useState("discover");
  const [discoverTab,setDiscoverTab]=useState("smart");
  const [prompt,setPrompt]=useState("");
  const [wc,setWc]=useState(0);
  const [recs,setRecs]=useState([]);
  const [started,setStarted]=useState(false);
  const [rkey,setRkey]=useState(0);
  const [loading,setLoading]=useState(false);
  const [resultLabel,setResultLabel]=useState("");
  const [analyticsData,setAnalyticsData]=useState(null);
  const [analyticsLoading,setAnalyticsLoading]=useState(false);
  const [geoInfo,setGeoInfo]=useState(null);
  const [forYouIdx,setForYouIdx]=useState(0);

  const fmtTime=now.current.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
  const fmtDate=now.current.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});
  const ac=cinema!=="All"?CINEMA_COLORS[cinema]:SHALINI_PRIMARY;

  // Geo tracking on mount
  useEffect(()=>{
    (async()=>{
      try{const res=await fetch("https://ipapi.co/json/");const data=await res.json();const info={country:data.country_name||"Unknown",code:data.country_code||"?",city:data.city||"",flag:getFlagEmoji(data.country_code||"")};setGeoInfo(info);await trackVisit(info.country,info.code);}
      catch{setGeoInfo({country:"Unknown",code:"?",city:"",flag:"🌍"});await trackVisit("Unknown","?");}
    })();
  },[]);

  useEffect(()=>{
    if(mainTab==="analytics"){setAnalyticsLoading(true);loadStats().then(d=>{setAnalyticsData(d);setAnalyticsLoading(false);});}
  },[mainTab]);

  const langOptions=LANGS_BY_CINEMA[cinema]||["All"];

  function onCinemaChange(c){setCinema(c);setLang("All");}

  function onFind(){
    setRecs(filterMovies(slot,cinema,lang,audience,selectedMood));
    const ci=cinema!=="All"?CINEMA_FLAGS[cinema]+" "+cinema:"🌍 All";
    const mo=selectedMood?selectedMood.label:"";
    const au=audience?AUDIENCE_OPTIONS.find(x=>x.key===audience)?.label:"";
    setResultLabel(`${getTimeEmoji(slot)} ${slot}${ci?" · "+ci:""}${mo?" · "+mo:""}${au?" · "+au:""}`);
    setStarted(true);setRkey(k=>k+1);trackSearch(cinema);
  }

  function onPromptSubmit(){
    if(!prompt.trim())return;
    setLoading(true);
    setTimeout(()=>{
      setRecs(promptSearch(prompt,cinema,lang));
      setResultLabel(`💬 "${prompt.length>55?prompt.slice(0,55)+"…":prompt}"`);
      setStarted(true);setRkey(k=>k+1);setLoading(false);trackSearch(cinema);
    },700);
  }

  function onPromptChange(e){const v=e.target.value,w=v.trim()?v.trim().split(/\s+/).length:0;if(w<=100){setPrompt(v);setWc(w);}}

  // For You carousel
  const forYouVisible=FOR_YOU.slice(forYouIdx,forYouIdx+3);
  const canPrev=forYouIdx>0,canNext=forYouIdx+3<FOR_YOU.length;

  return(
    <div style={S.root}>
      <style>{CSS(ac)}</style>

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.hRow}>
          <div style={S.logo}>
            <span style={{fontSize:28}}>🎬</span>
            <div>
              <div style={{...S.logoName,color:ac}}>CineYatra</div>
              <div style={S.logoSub}>வணக்கம் Shalini 🌸 · உங்கள் திரை யாத்திரை</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            {geoInfo&&(
              <div style={S.geoBadge}>
                <span style={{fontSize:15}}>{geoInfo.flag}</span>
                <span style={{fontSize:11,color:"#b09070",fontFamily:"sans-serif"}}>{geoInfo.city?`${geoInfo.city}, `:""}{geoInfo.country}</span>
              </div>
            )}
            <div style={{textAlign:"right"}}>
              <div style={{...S.clockT,color:ac}}>{fmtTime}</div>
              <div style={S.clockD}>{fmtDate}</div>
            </div>
          </div>
        </div>
        <div style={S.navBar}>
          <div style={S.navInner}>
            {[["discover","🎬 Discover"],["foryou","🌸 For Shalini"],["analytics","📊 Analytics"]].map(([k,lbl])=>(
              <button key={k} style={{...S.navTab,...(mainTab===k?{borderBottom:`2px solid ${ac}`,color:ac}:{})}} onClick={()=>setMainTab(k)}>{lbl}</button>
            ))}
          </div>
        </div>
      </header>

      <main style={S.main}>

        {/* ── FOR SHALINI TAB ── */}
        {mainTab==="foryou"&&(
          <div>
            <div style={S.forYouHero}>
              <div style={{fontSize:32,marginBottom:8}}>🌸</div>
              <div style={{...S.forYouTitle,color:ac}}>Curated for You, Shalini</div>
              <div style={S.forYouDesc}>
                Bold thrillers · Tamil soul · Korean nostalgia · Japanese chills · Wuxia beauty · Slow-burn romance<br/>
                <span style={{color:"#555",fontSize:11}}>All picks rated 80%+ · Hand-selected for your personality</span>
              </div>
              <div style={S.dnaRow}>
                {["🔪 Thrillers","🌸 Romance","💔 Drama","⚔️ Epics","👁️ Horror","🥋 Martial Arts"].map(t=>(
                  <span key={t} style={{...S.dnaBadge,borderColor:ac+"40",color:ac+"cc"}}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:10,color:"#555",fontFamily:"sans-serif",letterSpacing:1,textTransform:"uppercase"}}>{FOR_YOU.length} picks · showing {forYouIdx+1}–{Math.min(forYouIdx+3,FOR_YOU.length)}</div>
              <div style={{display:"flex",gap:8}}>
                <button style={{...S.navBtn,opacity:canPrev?1:0.3}} onClick={()=>canPrev&&setForYouIdx(i=>i-3)} disabled={!canPrev}>← Prev</button>
                <button style={{...S.navBtn,opacity:canNext?1:0.3}} onClick={()=>canNext&&setForYouIdx(i=>i+3)} disabled={!canNext}>Next →</button>
              </div>
            </div>
            <div style={S.grid}>
              {forYouVisible.map((m,i)=><MovieCard key={m.id} movie={m} idx={i} ac={ac}/>)}
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {mainTab==="analytics"&&(
          <AnalyticsDashboard data={analyticsData} loading={analyticsLoading} ac={ac}/>
        )}

        {/* ── DISCOVER TAB ── */}
        {mainTab==="discover"&&(
          <div>
            {/* Mood quick-pick banner */}
            <div style={S.moodBar}>
              <div style={{fontSize:10,color:"#666",fontFamily:"sans-serif",letterSpacing:1.2,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:ac}}>✨</span> Shalini, how are you feeling tonight?
              </div>
              <div style={S.moodGrid}>
                {SHALINI_MOODS.map(m=>(
                  <button key={m.key} className="mood-btn"
                    style={{...S.moodBtn,...(selectedMood?.key===m.key?{background:ac+"22",border:`1px solid ${ac}70`,color:"#f0e0c0",boxShadow:`0 4px 16px ${ac}30`}:{})}}
                    onClick={()=>setSelectedMood(selectedMood?.key===m.key?null:m)}
                  >
                    <div style={{fontSize:14,fontWeight:"bold"}}>{m.label}</div>
                    <div style={{fontSize:9,color:"#666",fontFamily:"sans-serif",marginTop:2}}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <section style={S.card}>
              {/* Sub-tabs */}
              <div style={S.tabs}>
                <button style={{...S.tab,...(discoverTab==="smart"?{background:`linear-gradient(135deg,${ac},${ac}bb)`,color:"#1a0000"}:{})}} onClick={()=>setDiscoverTab("smart")}>🎛️ Smart Filter</button>
                <button style={{...S.tab,...(discoverTab==="prompt"?{background:`linear-gradient(135deg,${ac},${ac}bb)`,color:"#1a0000"}:{})}} onClick={()=>setDiscoverTab("prompt")}>💬 Ask in Words</button>
              </div>

              {discoverTab==="smart"?(
                <div>
                  {/* Cinema */}
                  <Sec title="🌍 Cinema" ac={ac}>
                    <div style={S.cinemaGrid}>
                      {CINEMAS.map(c=>(
                        <button key={c} style={{...S.cinemaBtn,...(cinema===c?{border:`1px solid ${CINEMA_COLORS[c]||ac}`,background:(CINEMA_COLORS[c]||ac)+"1a",color:"#f0e0b0",boxShadow:`0 3px 14px ${(CINEMA_COLORS[c]||ac)}30`}:{})}} onClick={()=>onCinemaChange(c)}>
                          <span style={{fontSize:20}}>{c==="All"?"🌍":CINEMA_FLAGS[c]}</span>
                          <span style={{fontSize:9,color:"#a09070",fontFamily:"sans-serif",fontWeight:600,marginTop:2}}>{c}</span>
                        </button>
                      ))}
                    </div>
                  </Sec>

                  {/* Time */}
                  <Sec title={`${getTimeEmoji(slot)} When?`} ac={ac}>
                    <div style={S.pillRow}>
                      {TIME_SLOTS.map(sl=>(
                        <button key={sl} style={{...S.pill,...(slot===sl?{background:ac+"28",border:`1px solid ${ac}60`,color:"#f0e0c0",boxShadow:`0 2px 10px ${ac}25`}:{})}} onClick={()=>setSlot(sl)}>
                          {getTimeEmoji(sl)} {sl[0].toUpperCase()+sl.slice(1)}
                        </button>
                      ))}
                    </div>
                  </Sec>

                  {/* Audience */}
                  <Sec title="👥 Who's with you?" ac={ac}>
                    <div style={S.audGrid}>
                      {AUDIENCE_OPTIONS.map(o=>(
                        <button key={o.key} style={{...S.audBtn,...(audience===o.key?{border:`1px solid ${ac}`,background:ac+"14",boxShadow:`0 3px 12px ${ac}25`}:{})}} onClick={()=>setAudience(audience===o.key?null:o.key)}>
                          <span style={{fontSize:18}}>{o.emoji}</span>
                          <span style={{fontSize:11,color:"#d0c060",fontFamily:"sans-serif",fontWeight:600}}>{o.label}</span>
                          <span style={{fontSize:9,color:"#555",fontFamily:"sans-serif"}}>{o.desc}</span>
                        </button>
                      ))}
                    </div>
                  </Sec>

                  {/* Language */}
                  <Sec title="🌐 Language" ac={ac}>
                    <div style={S.pillRow}>
                      {langOptions.map(l=>(
                        <button key={l} style={{...S.pill,...(lang===l?{background:"#1a4a2028",border:"1px solid #4a9a5060",color:"#a0ffb0"}:{})}} onClick={()=>setLang(l)}>{l}</button>
                      ))}
                    </div>
                  </Sec>

                  <div style={{display:"flex",gap:10,marginTop:4,flexWrap:"wrap"}}>
                    <button className="cta-btn" style={{...S.ctaBtn,background:`linear-gradient(135deg,${ac},${ac}cc)`}} onClick={onFind}>🎯 Find My 3 Movies</button>
                    {started&&<button className="sec-btn" style={S.secBtn} onClick={onFind}>✨ 3 More</button>}
                  </div>
                </div>
              ):(
                <div>
                  <Sec title="💬 Tell Shalini's algorithm what you want" ac={ac}>
                    <p style={{fontSize:11,color:"#556",fontFamily:"sans-serif",margin:"0 0 10px",lineHeight:1.6}}>
                      Try: <i>"a Tamil thriller for a rainy night with snacks"</i> or <i>"something Korean that'll make me cry"</i> or <i>"a wuxia epic for Saturday with husband"</i>
                    </p>
                    <div style={S.pillRow}>
                      {CINEMAS.map(c=>(
                        <button key={c} style={{...S.pill,...(cinema===c?{background:(CINEMA_COLORS[c]||ac)+"25",border:`1px solid ${CINEMA_COLORS[c]||ac}60`,color:"#f0e0b0"}:{})}} onClick={()=>onCinemaChange(c)}>
                          {c==="All"?"🌍":CINEMA_FLAGS[c]} {c}
                        </button>
                      ))}
                    </div>
                    <textarea style={S.ta} rows={3}
                      placeholder={`"A slow-burn Korean thriller for girls night" · "Tamil emotional drama, something nostalgic"`}
                      value={prompt} onChange={onPromptChange}
                    />
                    <div style={{display:"flex",alignItems:"center",gap:12,marginTop:10,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,color:wc>90?"#e87040":"#555",fontFamily:"sans-serif"}}>{wc}/100 words</span>
                      <button className="cta-btn" style={{...S.ctaBtn,background:`linear-gradient(135deg,${ac},${ac}cc)`,opacity:(loading||!prompt.trim())?0.5:1}}
                        onClick={onPromptSubmit} disabled={loading||!prompt.trim()}>
                        {loading?"⏳ Finding…":"🎬 Get Picks"}
                      </button>
                    </div>
                  </Sec>
                </div>
              )}
            </section>

            {/* Results */}
            {started&&(
              <section key={rkey} style={{animation:"fadeIn .4s ease"}}>
                <div style={{fontSize:12,color:ac+"bb",fontFamily:"sans-serif",fontStyle:"italic",marginBottom:14}}>{resultLabel}</div>
                <div style={S.grid}>
                  {recs.map((m,i)=><MovieCard key={`${m.id}-${rkey}`} movie={m} idx={i} ac={ac}/>)}
                </div>
              </section>
            )}

            {/* Hero (pre-search) */}
            {!started&&(
              <div style={S.hero}>
                <div style={S.heroBg}>{["🔪","🌸","🇮🇳","🇰🇷","🥋","👁️","🎭","🌺","⚔️"].map((e,i)=>(
                  <span key={i} style={{fontSize:48,opacity:0.04+(i%3)*0.025}}>{e}</span>
                ))}</div>
                <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
                  <div style={{...S.heroTitle,color:ac,textShadow:`0 0 40px ${ac}40`}}>வணக்கம், Shalini ✨</div>
                  <div style={{fontSize:13,color:"#604848",maxWidth:480,margin:"0 auto 16px",lineHeight:1.9,fontFamily:"sans-serif"}}>
                    Your personal cinema compass — <b style={{color:"#b08060"}}>Tamil thrillers</b> that give you goosebumps,
                    <b style={{color:"#b08060"}}> Korean nostalgia</b> from college days,
                    <b style={{color:"#b08060"}}> Japanese horror</b> for brave nights,
                    and <b style={{color:"#b08060"}}>wuxia epics</b> that take your breath away.
                  </div>
                  <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                    {["🔪 Bold","💔 Nostalgic","🔍 Analytical","🌸 Romantic","☕ Chill"].map(t=>(
                      <span key={t} style={{fontSize:11,fontFamily:"sans-serif",border:`1px solid ${ac}35`,color:ac+"99",borderRadius:20,padding:"4px 12px"}}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── SECTION WRAPPER ───────────────────────────────────────────────────────────
function Sec({title,ac,children}){
  return(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:10,color:ac||SHALINI_PRIMARY,fontFamily:"sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{title}</div>
      {children}
    </div>
  );
}

// ── MOVIE CARD ────────────────────────────────────────────────────────────────
function MovieCard({movie,idx,ac}){
  const cc=CINEMA_COLORS[movie.cinema]||ac||SHALINI_PRIMARY;
  return(
    <div style={{...S.mCard,borderColor:cc+"22",animationDelay:`${idx*0.12}s`}} className="movie-card">
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <div style={{fontSize:30,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:9,background:cc+"15",border:`1px solid ${cc}25`,flexShrink:0}}>{movie.poster}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:"bold",color:"#f0d080",lineHeight:1.2,marginBottom:3}}>{movie.title}</div>
          <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
            <span style={{fontSize:9,color:"#444",fontFamily:"sans-serif"}}>{movie.year}</span>
            <span style={{fontSize:9,fontFamily:"sans-serif",fontWeight:600,borderRadius:10,padding:"2px 7px",color:cc,border:`1px solid ${cc}40`,background:cc+"12"}}>{CINEMA_FLAGS[movie.cinema]} {movie.cinema}</span>
            {movie.shalini&&<span style={{fontSize:9,fontFamily:"sans-serif",fontWeight:600,borderRadius:10,padding:"2px 7px",color:SHALINI_PRIMARY,border:`1px solid ${SHALINI_PRIMARY}40`,background:SHALINI_PRIMARY+"10"}}>🌸 For You</span>}
          </div>
          <RTBadge rt={movie.rt}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:5}}>
            {movie.language.slice(0,2).map(l=><span key={l} style={{background:"#0a2510",border:"1px solid #2a6a3018",borderRadius:10,color:"#60c070",padding:"2px 7px",fontSize:9,fontFamily:"sans-serif"}}>{l}</span>)}
            {movie.genre.slice(0,2).map(g=><span key={g} style={{background:"#180f00",border:`1px solid ${cc}22`,borderRadius:10,color:cc+"bb",padding:"2px 7px",fontSize:9,fontFamily:"sans-serif"}}>{g}</span>)}
          </div>
        </div>
      </div>
      <div style={{height:1,background:"#ffffff08",margin:"8px 0"}}/>
      <div style={{fontSize:9,color:"#555",fontFamily:"sans-serif",letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>📝 What's it about</div>
      <p style={{fontSize:11,color:"#8a7858",lineHeight:1.75,fontFamily:"sans-serif",margin:"0 0 10px"}}>{movie.summary}</p>
      <div style={{height:1,background:"#ffffff08",margin:"8px 0"}}/>
      <div style={{fontSize:9,color:"#555",fontFamily:"sans-serif",letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>📺 Where to watch</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
        {movie.platforms.map(p=><span key={p} style={{background:"#0a1828",border:"1px solid #2060a018",borderRadius:8,color:"#5080b0",padding:"3px 8px",fontSize:10,fontFamily:"sans-serif",fontWeight:600}}>{p}</span>)}
      </div>
    </div>
  );
}

// ── ANALYTICS DASHBOARD ───────────────────────────────────────────────────────
function AnalyticsDashboard({data,loading,ac}){
  if(loading)return<div style={{textAlign:"center",padding:"60px",color:"#555",fontFamily:"sans-serif"}}><div style={{fontSize:32,marginBottom:12}}>📊</div>Loading analytics…</div>;
  if(!data)return null;
  const countries=Object.entries(data.countries||{}).map(([k,v])=>{const[code,name]=k.split("|");return{code,name,count:v,flag:getFlagEmoji(code)};}).sort((a,b)=>b.count-a.count);
  const cinemas=Object.entries(data.cinemas||{}).sort((a,b)=>b[1]-a[1]);
  const maxC=countries[0]?.count||1,maxCi=cinemas[0]?.[1]||1;
  const lastUp=data.lastUpdated?new Date(data.lastUpdated).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}):"Never";
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        {[{label:"Total Views",val:(data.totalViews||0).toLocaleString(),icon:"👁️",col:ac},{label:"Searches",val:(data.searches||0).toLocaleString(),icon:"🔍",col:"#4a9a50"},{label:"Countries",val:countries.length,icon:"🌍",col:"#5080d0"},{label:"Last Visit",val:lastUp,icon:"🕐",col:"#a06080",sm:true}].map((st,i)=>(
          <div key={i} style={{background:"#0e0a05",border:`1px solid ${st.col}25`,borderRadius:12,padding:"18px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:6}}>{st.icon}</div>
            <div style={{fontSize:st.sm?13:24,fontWeight:"bold",color:st.col,marginBottom:4,lineHeight:1}}>{st.val}</div>
            <div style={{fontSize:10,color:"#555",fontFamily:"sans-serif",letterSpacing:1,textTransform:"uppercase"}}>{st.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        <div style={{background:"#0e0a05",border:"1px solid #ffffff08",borderRadius:14,padding:20}}>
          <div style={{fontSize:11,color:ac,fontFamily:"sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>🌍 Views by Country</div>
          {countries.length===0?<div style={{fontSize:12,color:"#444",fontFamily:"sans-serif",textAlign:"center",padding:"20px 0"}}>No data yet!</div>:countries.slice(0,10).map((c,i)=>(
            <div key={c.code} style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:15}}>{c.flag}</span>
                <span style={{fontSize:12,color:"#c0b090",fontFamily:"sans-serif",flex:1}}>{c.name}</span>
                <span style={{fontSize:11,color:"#666",fontFamily:"sans-serif"}}>{c.count}</span>
              </div>
              <div style={{height:6,background:"#1a1510",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:3,width:`${(c.count/maxC)*100}%`,background:i===0?ac:`${ac}70`,animation:"barGrow .6s ease both",animationDelay:`${i*0.06}s`}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"#0e0a05",border:"1px solid #ffffff08",borderRadius:14,padding:20}}>
          <div style={{fontSize:11,color:ac,fontFamily:"sans-serif",letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>🎬 Cinema Preferences</div>
          {cinemas.length===0?<div style={{fontSize:12,color:"#444",fontFamily:"sans-serif",textAlign:"center",padding:"20px 0"}}>Search to see preferences!</div>:cinemas.map(([name,cnt],i)=>(
            <div key={name} style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:15}}>{CINEMA_FLAGS[name]||"🌍"}</span>
                <span style={{fontSize:12,color:"#c0b090",fontFamily:"sans-serif",flex:1}}>{name}</span>
                <span style={{fontSize:11,color:"#666",fontFamily:"sans-serif"}}>{cnt}</span>
              </div>
              <div style={{height:6,background:"#1a1510",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:3,width:`${(cnt/maxCi)*100}%`,background:CINEMA_COLORS[name]||ac,animation:"barGrow .6s ease both",animationDelay:`${i*0.08}s`}}/>
              </div>
            </div>
          ))}
          <div style={{marginTop:20,padding:14,background:"#0a0706",borderRadius:10,border:"1px solid #ffffff06"}}>
            <div style={{fontSize:9,color:"#555",fontFamily:"sans-serif",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>📡 Recent Countries</div>
            {countries.slice(0,5).map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<4?"1px solid #ffffff06":"none"}}>
                <span style={{fontSize:15}}>{c.flag}</span>
                <span style={{fontSize:11,color:"#b0a080",fontFamily:"sans-serif",flex:1}}>{c.name}</span>
                <span style={{fontSize:10,color:ac,fontFamily:"sans-serif"}}>{"●".repeat(Math.min(c.count,5))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{fontSize:10,color:"#2a2a2a",fontFamily:"sans-serif",textAlign:"center",padding:"12px 0",marginTop:8}}>Analytics stored in shared persistent storage · resets if artifact is recreated</div>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S={
  root:{minHeight:"100vh",background:"#070304",color:"#f0e4c8",fontFamily:"Georgia,serif",backgroundImage:"radial-gradient(ellipse at 10% 10%,#1a0608 0%,transparent 55%),radial-gradient(ellipse at 90% 90%,#060308 0%,transparent 55%)"},
  header:{background:"linear-gradient(135deg,#140608,#060308)",borderBottom:"1px solid #ffffff08"},
  hRow:{maxWidth:1060,margin:"0 auto",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8},
  logo:{display:"flex",alignItems:"center",gap:12},
  logoName:{fontSize:22,fontWeight:"bold",letterSpacing:2},
  logoSub:{fontSize:10,color:"#604848",letterSpacing:.5,fontFamily:"sans-serif"},
  geoBadge:{display:"flex",alignItems:"center",gap:6,background:"#1a0e0c",border:"1px solid #ffffff0d",borderRadius:20,padding:"5px 12px"},
  clockT:{fontSize:16,fontWeight:"bold",fontFamily:"monospace",textAlign:"right"},
  clockD:{fontSize:9,color:"#444",fontFamily:"sans-serif",textAlign:"right"},
  navBar:{borderTop:"1px solid #ffffff08"},
  navInner:{maxWidth:1060,margin:"0 auto",padding:"0 20px",display:"flex"},
  navTab:{background:"transparent",border:"none",borderBottom:"2px solid transparent",color:"#555",cursor:"pointer",fontFamily:"sans-serif",fontSize:12,fontWeight:600,padding:"10px 16px",transition:"all .2s",letterSpacing:.5},
  main:{maxWidth:1060,margin:"0 auto",padding:"20px 18px"},
  // For You
  forYouHero:{background:"linear-gradient(135deg,#1a0810,#0a0614)",border:"1px solid #ffffff08",borderRadius:16,padding:"30px 24px",textAlign:"center",marginBottom:20},
  forYouTitle:{fontSize:22,fontWeight:"bold",letterSpacing:1,marginBottom:10},
  forYouDesc:{fontSize:13,color:"#806058",fontFamily:"sans-serif",lineHeight:1.8,marginBottom:14},
  dnaRow:{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"},
  dnaBadge:{fontSize:11,fontFamily:"sans-serif",fontWeight:600,border:"1px solid",borderRadius:20,padding:"4px 12px"},
  navBtn:{background:"transparent",border:"1px solid #ffffff15",borderRadius:8,color:"#806058",padding:"6px 14px",cursor:"pointer",fontFamily:"sans-serif",fontSize:11,transition:"all .2s"},
  // Mood bar
  moodBar:{background:"#0e0a07",border:"1px solid #ffffff08",borderRadius:14,padding:"16px 18px",marginBottom:16},
  moodGrid:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8},
  moodBtn:{background:"#130d0a",border:"1px solid #ffffff0a",borderRadius:10,padding:"10px 6px",cursor:"pointer",textAlign:"center",transition:"all .2s",color:"#a09070"},
  // Card
  card:{background:"#0e0905",border:"1px solid #ffffff08",borderRadius:16,padding:"20px",marginBottom:20,boxShadow:"0 8px 36px #00000060"},
  tabs:{display:"flex",marginBottom:20,borderRadius:10,overflow:"hidden",border:"1px solid #ffffff10",width:"fit-content"},
  tab:{padding:"8px 18px",background:"transparent",border:"none",color:"#666",cursor:"pointer",fontFamily:"sans-serif",fontSize:12,fontWeight:600,letterSpacing:.4,transition:"all .2s"},
  cinemaGrid:{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:7},
  cinemaBtn:{background:"#130d0a",border:"1px solid #ffffff10",borderRadius:10,padding:"9px 5px",cursor:"pointer",textAlign:"center",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  pillRow:{display:"flex",gap:7,flexWrap:"wrap"},
  pill:{background:"#181208",border:"1px solid #ffffff10",borderRadius:20,color:"#806050",padding:"6px 14px",cursor:"pointer",fontFamily:"sans-serif",fontSize:12,transition:"all .2s"},
  audGrid:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7},
  audBtn:{background:"#110a07",border:"1px solid #ffffff08",borderRadius:10,padding:"9px 5px",cursor:"pointer",textAlign:"center",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  ctaBtn:{border:"none",borderRadius:10,color:"#1a0000",padding:"11px 26px",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:"bold",letterSpacing:.4,boxShadow:"0 4px 18px #00000050",transition:"all .2s"},
  secBtn:{background:"transparent",border:"1px solid #ffffff15",borderRadius:10,color:"#a09060",padding:"11px 20px",cursor:"pointer",fontFamily:"sans-serif",fontSize:12,transition:"all .2s"},
  ta:{width:"100%",background:"#0c0806",border:"1px solid #ffffff10",borderRadius:10,color:"#f0e0c0",padding:"11px 13px",fontFamily:"sans-serif",fontSize:13,lineHeight:1.7,resize:"vertical",outline:"none",boxSizing:"border-box",marginTop:10},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:16,marginBottom:16},
  mCard:{background:"linear-gradient(160deg,#120a08,#070a07)",border:"1px solid",borderRadius:14,padding:"18px",animation:"fadeUp .5s ease both",transition:"all .2s"},
  hero:{borderRadius:16,background:"#0c0807",border:"1px solid #ffffff06",padding:"40px 24px",position:"relative",overflow:"hidden",textAlign:"center",marginTop:4},
  heroBg:{position:"absolute",inset:0,display:"grid",gridTemplateColumns:"repeat(3,1fr)",alignItems:"center",justifyItems:"center",pointerEvents:"none"},
  heroTitle:{fontSize:20,fontWeight:"bold",letterSpacing:1,marginBottom:12},
};

const CSS=(ac)=>`
  *{box-sizing:border-box;} body{margin:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes barGrow{from{width:0!important}to{}}
  .movie-card:hover{transform:translateY(-3px)!important;box-shadow:0 10px 28px #00000090!important;border-color:${ac}40!important;}
  .cta-btn:hover{transform:translateY(-2px)!important;box-shadow:0 8px 24px ${ac}55!important;}
  .sec-btn:hover{background:#ffffff08!important;}
  .mood-btn:hover{background:${ac}12!important;border-color:${ac}40!important;}
  textarea:focus{border-color:${ac}50!important;}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#070304}::-webkit-scrollbar-thumb{background:${ac}30;border-radius:3px}
  @media(max-width:640px){
    div[style*="repeat(6,1fr)"]{grid-template-columns:repeat(3,1fr)!important;}
    div[style*="repeat(5,1fr)"]{grid-template-columns:repeat(3,1fr)!important;}
    div[style*="repeat(6,1fr)"].mood{grid-template-columns:repeat(2,1fr)!important;}
  }
`;
