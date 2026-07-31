from database import SessionLocal
from models import LessonTier, Lesson, QuizQuestion

def seed():
    db = SessionLocal()

    # -------------------------
    # 1. Create tiers (if missing)
    # -------------------------
    tier0 = db.query(LessonTier).filter(LessonTier.order_index == 0).first()
    if not tier0:
        tier0 = LessonTier(
            name_en="Digital Basics",
            name_bn="ডিজিটাল বেসিক্স",
            order_index=0,
            unlock_requirement=0,
        )
        db.add(tier0)
        db.commit()
        db.refresh(tier0)
        print("✅ Created Tier 0")
    else:
        print("ℹ️ Tier 0 already exists")

    tier1 = db.query(LessonTier).filter(LessonTier.order_index == 1).first()
    if not tier1:
        tier1 = LessonTier(
            name_en="Cyber Hygiene",
            name_bn="সাইবার স্বাস্থ্যবিধি",
            order_index=1,
            unlock_requirement=3,
        )
        db.add(tier1)
        db.commit()
        db.refresh(tier1)
        print("✅ Created Tier 1")
    else:
        print("ℹ️ Tier 1 already exists")

    tier2 = db.query(LessonTier).filter(LessonTier.order_index == 2).first()
    if not tier2:
        tier2 = LessonTier(
            name_en="Threat Awareness",
            name_bn="হুমকি সচেতনতা",
            order_index=2,
            unlock_requirement=4,
        )
        db.add(tier2)
        db.commit()
        db.refresh(tier2)
        print("✅ Created Tier 2")
    else:
        print("ℹ️ Tier 2 already exists")

    tier3 = db.query(LessonTier).filter(LessonTier.order_index == 3).first()
    if not tier3:
        tier3 = LessonTier(
            name_en="Advanced / Technical",
            name_bn="উন্নত / প্রযুক্তিগত",
            order_index=3,
            unlock_requirement=4,
        )
        db.add(tier3)
        db.commit()
        db.refresh(tier3)
        print("✅ Created Tier 3")
    else:
        print("ℹ️ Tier 3 already exists")

    # -------------------------
    # 2. All lessons data (23 lessons total)
    # -------------------------
    lessons_data = [
        # ---- Tier 0 (5) ----
        (
            "What Is Cybersecurity, and Why It's Your Problem Too",
            "সাইবার নিরাপত্তা কী, এবং এটা কেন আপনার সমস্যাও",
            "Hook: \"I'm nobody important, why would a hacker target me?\" This is the single most common — and most dangerous — belief people have about cybersecurity.\n\nCore Explanation: Cybersecurity isn't just about protecting presidents, banks, and big companies. It's about protecting anyone with a phone number, a bank account, or a social media profile — which means you. Most attacks aren't personal; they're automated. Scammers send the same fraudulent message to 100,000 people at once, hoping even 1% fall for it. You don't need to be \"important\" to be a target — you just need to be reachable, and you already are.\n\nBangladesh Example: In 2023-2024, Bangladesh saw a sharp rise in mobile financial services (MFS) fraud — bKash and Nagad related scams cost citizens crores of taka, mostly through simple SMS and phone call tricks, not sophisticated hacking. The victims weren't celebrities or executives — they were ordinary people going about their day.\n\nTakeaway: Cybersecurity is not \"IT's problem\" or \"someone else's problem\" — it's a basic life skill now, the same way locking your front door is.",
            "Hook: \"আমি তো কেউ গুরুত্বপূর্ণ মানুষ না, হ্যাকার কেন আমাকে টার্গেট করবে?\" — এটাই সাইবার নিরাপত্তা নিয়ে মানুষের সবচেয়ে সাধারণ, এবং সবচেয়ে বিপজ্জনক ভুল ধারণা।\n\nমূল ব্যাখ্যা: সাইবার নিরাপত্তা শুধু প্রেসিডেন্ট, ব্যাংক, বা বড় কোম্পানিকে রক্ষা করার বিষয় না। এটা এমন যে কাউকে রক্ষা করার বিষয়, যার একটা ফোন নম্বর, একটা ব্যাংক অ্যাকাউন্ট, বা একটা সোশ্যাল মিডিয়া প্রোফাইল আছে — মানে আপনাকে। বেশিরভাগ আক্রমণ ব্যক্তিগত না, এগুলো স্বয়ংক্রিয়। স্ক্যামাররা একই প্রতারণামূলক মেসেজ একসাথে ১ লক্ষ মানুষকে পাঠায়, আশা করে যে তাদের মধ্যে ১% হলেও ফাঁদে পড়বে। \"গুরুত্বপূর্ণ\" হতে হবে না টার্গেট হওয়ার জন্য — শুধু \"পৌঁছানো সম্ভব\" হতে হবে, এবং আপনি ইতিমধ্যেই তাই।\n\nবাংলাদেশের উদাহরণ: ২০২৩-২০২৪ সালে বাংলাদেশে মোবাইল ফাইন্যান্সিয়াল সার্ভিস প্রতারণা অনেক বেড়েছে — বিকাশ ও নগদ সম্পর্কিত স্ক্যামে নাগরিকদের কোটি কোটি টাকা ক্ষতি হয়েছে, বেশিরভাগ ক্ষেত্রেই সাধারণ এসএমএস আর ফোন কলের মাধ্যমে। ভুক্তভোগীরা সাধারণ মানুষ, নিজেদের দৈনন্দিন কাজ করছিলেন।\n\nসংক্ষিপ্ত শিক্ষা: সাইবার নিরাপত্তা এখন \"আইটি বিভাগের সমস্যা\" না — এটা একটা মৌলিক জীবন-দক্ষতা, ঠিক যেমন দরজায় তালা দেওয়া।",
            4,
        ),
        (
            "Scam vs. Hack vs. Virus — Know the Difference",
            "স্ক্যাম বনাম হ্যাক বনাম ভাইরাস — পার্থক্য জানুন",
            "Hook: People often say \"I got hacked\" when what actually happened was very different.\n\nCore Explanation: A scam tricks you into giving up information or money voluntarily — no technical break-in required. A hack is unauthorized access to an account or system, often via a technical weakness or stolen password. A virus (malware) is malicious software running on your device — it can spy on you or steal data, often after just installing an infected app or file.\n\nBangladesh Example: A fake \"bKash agent\" call convincing you to share your PIN is a scam. Someone guessing/stealing your Facebook password is a hack. A cracked movie app secretly reading your messages is malware.\n\nTakeaway: Scams exploit trust, hacks exploit technical access, malware exploits software — knowing which one you're facing changes what you should do next.",
            "Hook: মানুষ প্রায়ই বলে \"আমি হ্যাক হয়ে গেছি,\" কিন্তু আসলে যা ঘটেছে তা সম্পূর্ণ ভিন্ন কিছু।\n\nমূল ব্যাখ্যা: একটা স্ক্যাম আপনাকে ফাঁদে ফেলে স্বেচ্ছায় তথ্য বা টাকা দিতে বাধ্য করে — কোনো টেকনিক্যাল অনুপ্রবেশ ছাড়াই। একটা হ্যাক হলো অনুমতি ছাড়া অ্যাকাউন্ট বা সিস্টেমে প্রবেশ, প্রায়ই টেকনিক্যাল দুর্বলতা বা চুরি করা পাসওয়ার্ড দিয়ে। একটা ভাইরাস (ম্যালওয়্যার) হলো ক্ষতিকর সফটওয়্যার যা আপনার ডিভাইসে চলে।\n\nবাংলাদেশের উদাহরণ: ভুয়া \"বিকাশ এজেন্ট\" কল যা আপনাকে পিন শেয়ার করাতে রাজি করায় তা একটা স্ক্যাম। কেউ আপনার ফেসবুক পাসওয়ার্ড চুরি করে লগইন করলে তা একটা হ্যাক।\n\nসংক্ষিপ্ত শিক্ষা: স্ক্যাম বিশ্বাসের অপব্যবহার করে, হ্যাক টেকনিক্যাল অ্যাক্সেসের অপব্যবহার করে, ম্যালওয়্যার সফটওয়্যারের অপব্যবহার করে।",
            4,
        ),
        (
            "Your Digital Footprint",
            "আপনার ডিজিটাল ফুটপ্রিন্ট",
            "Hook: Search your own name online right now. What you find might surprise you.\n\nCore Explanation: Your digital footprint is the trail of information you leave behind through posts, comments, photos, and public profiles. Active footprint is what you deliberately post; passive footprint is data collected without direct action (browsing history, location). Scammers use publicly available information (OSINT) to research targets before crafting personalized scams.\n\nBangladesh Example: A scammer targeting job seekers might see a public post saying \"looking for job, urgent\" and send a fake offer referencing that exact situation, making the scam feel personal.\n\nTakeaway: Before posting, ask: \"Would I be comfortable with a stranger with bad intentions seeing this?\"",
            "Hook: এখনই নিজের নাম অনলাইনে সার্চ করুন। আপনি যা পাবেন তা আপনাকে অবাক করতে পারে।\n\nমূল ব্যাখ্যা: আপনার ডিজিটাল ফুটপ্রিন্ট হলো পোস্ট, কমেন্ট, ছবি, এবং পাবলিক প্রোফাইলের মাধ্যমে আপনি যে তথ্যের চিহ্ন রেখে যান। সক্রিয় ফুটপ্রিন্ট হলো আপনি ইচ্ছাকৃতভাবে যা পোস্ট করেন; নিষ্ক্রিয় ফুটপ্রিন্ট হলো সরাসরি কাজ ছাড়াই সংগ্রহ করা ডেটা। স্ক্যামাররা পাবলিক তথ্য (OSINT) ব্যবহার করে ব্যক্তিগতকৃত স্ক্যাম তৈরি করে।\n\nবাংলাদেশের উদাহরণ: চাকরিপ্রার্থীদের টার্গেট করা একজন স্ক্যামার একটা পাবলিক পোস্ট দেখে \"চাকরি খুঁজছি, জরুরি\" এবং সেই পরিস্থিতির উল্লেখ করে ভুয়া অফার পাঠাতে পারে।\n\nসংক্ষিপ্ত শিক্ষা: পোস্ট করার আগে জিজ্ঞাসা করুন: \"খারাপ উদ্দেশ্যের অপরিচিত মানুষ এটা দেখলে আমি স্বাচ্ছন্দ্য বোধ করব?\"",
            4,
        ),
        (
            "Spotting a Fake Website Before You Trust It",
            "বিশ্বাস করার আগে ভুয়া ওয়েবসাইট চেনার উপায়",
            "Hook: Fake websites don't announce themselves — but they leave small clues.\n\nCore Explanation: Check: (1) the padlock/https:// icon (encrypted, but not a legitimacy guarantee), (2) exact domain spelling (scammers use lookalike domains), (3) design quality (broken layouts, spelling mistakes), (4) unusual urgency (\"verify now or lose your account\").\n\nBangladesh Example: Fake bKash/Nagad/bank login pages circulate via SMS links, often one letter off from the real domain, looking nearly identical to the real page.\n\nTakeaway: Never trust an unprompted link — type the official address yourself or use the official app.",
            "Hook: ভুয়া ওয়েবসাইট নিজে থেকে জানান দেয় না — কিন্তু ছোট চিহ্ন রেখে যায়।\n\nমূল ব্যাখ্যা: যাচাই করুন: (১) প্যাডলক/https:// আইকন, (২) সঠিক ডোমেইন বানান, (৩) ডিজাইনের মান, (৪) অস্বাভাবিক তাড়াহুড়ো।\n\nবাংলাদেশের উদাহরণ: বিকাশ/নগদ/ব্যাংকের ভুয়া লগইন পেজ এসএমএস লিংকের মাধ্যমে ছড়ায়, প্রায়ই আসল ডোমেইনের থেকে একটা অক্ষর ভিন্ন।\n\nসংক্ষিপ্ত শিক্ষা: অযাচিত লিংক কখনো বিশ্বাস করবেন না — নিজে ঠিকানা টাইপ করুন বা অফিসিয়াল অ্যাপ ব্যবহার করুন।",
            4,
        ),
        (
            "Basic Device Hygiene",
            "মৌলিক ডিভাইস স্বাস্থ্যবিধি",
            "Hook: Most people update their phone only when forced to.\n\nCore Explanation: Three habits matter most: (1) install updates promptly — they patch known security holes, (2) use a screen lock — a lost unlocked phone gives instant access to everything, (3) review app permissions — revoke access apps don't actually need.\n\nBangladesh Example: Sharing your unlocked phone with a shop technician for \"quick help\" is enough time for someone with bad intent to install something malicious.\n\nTakeaway: Small daily habits — updates, screen lock, permission checks — block the majority of casual attacks.",
            "Hook: বেশিরভাগ মানুষ শুধু বাধ্য হলেই ফোন আপডেট করে।\n\nমূল ব্যাখ্যা: তিনটা অভ্যাস সবচেয়ে গুরুত্বপূর্ণ: (১) দ্রুত আপডেট ইনস্টল করা, (২) স্ক্রিন লক ব্যবহার করা, (৩) অ্যাপ পারমিশন পর্যালোচনা করা।\n\nবাংলাদেশের উদাহরণ: দোকানের টেকনিশিয়ানের সাথে আনলক করা ফোন শেয়ার করা যথেষ্ট সময় কারো জন্য ক্ষতিকর কিছু ইনস্টল করতে।\n\nসংক্ষিপ্ত শিক্ষা: প্রতিদিনের ছোট অভ্যাস বেশিরভাগ সাধারণ আক্রমণ প্রতিরোধ করে।",
            4,
        ),
        # ---- Tier 1 (6) ----
        (
            "Password Fundamentals",
            "পাসওয়ার্ডের মৌলিক বিষয়",
            "Hook: 'I use the same password for everything — it's easier to remember.' This is the single most dangerous habit online.\n\nCore Explanation: Passwords are the first line of defense. Length beats complexity: a 12-character passphrase like 'BlueFish!Jumps@9' is stronger than 'P@ssw0rd'. Never reuse passwords across sites — if one site gets breached, attackers try that password everywhere. Use a password manager to generate and store unique passwords for each site.\n\nBangladesh Example: In 2024, a major Bangladeshi e-commerce site suffered a data leak. Users who reused passwords lost access to their Facebook, bKash, and email accounts within hours because attackers automated login attempts.\n\nTakeaway: Use a unique, strong password for every account — a password manager makes this easy. The few seconds it saves you now can save you days of damage later.",
            "Hook: 'সব জায়গায় একই পাসওয়ার্ড ব্যবহার করি — মনে রাখা সহজ হয়।' এটাই অনলাইনের সবচেয়ে বিপজ্জনক অভ্যাস।\n\nমূল ব্যাখ্যা: পাসওয়ার্ড হলো প্রথম প্রতিরক্ষা। দৈর্ঘ্য জটিলতার চেয়ে বেশি কার্যকর: 'BlueFish!Jumps@9'-এর মতো ১২ অক্ষরের পাসফ্রেজ 'P@ssw0rd'-এর চেয়ে বেশি শক্তিশালী। কখনো একই পাসওয়ার্ড একাধিক সাইটে ব্যবহার করবেন না — যদি একটি সাইট হ্যাক হয়, আক্রমণকারীরা সেটি অন্য সব জায়গায় চেষ্টা করে। পাসওয়ার্ড ম্যানেজার ব্যবহার করুন প্রতিটি সাইটের জন্য আলাদা শক্তিশালী পাসওয়ার্ড তৈরি ও সংরক্ষণ করতে।\n\nবাংলাদেশের উদাহরণ: ২০২৪ সালে একটি বড় বাংলাদেশি ই-কমার্স সাইটের ডেটা লিক হয়। যে ব্যবহারকারীরা পাসওয়ার্ড পুনরায় ব্যবহার করেছিলেন, তাদের ফেসবুক, বিকাশ, ও ইমেইল অ্যাকাউন্ট ঘণ্টার মধ্যে হ্যাক হয়ে যায় — আক্রমণকারীরা স্বয়ংক্রিয়ভাবে লগইন চেষ্টা করেছিল।\n\nসংক্ষিপ্ত শিক্ষা: প্রতিটি অ্যাকাউন্টের জন্য আলাদা, শক্তিশালী পাসওয়ার্ড ব্যবহার করুন — পাসওয়ার্ড ম্যানেজার এটা সহজ করে দেয়। এখনকার কয়েক সেকেন্ড বাঁচালে পরে বড় ক্ষতি থেকে রক্ষা পাবেন।",
            5,
        ),
        (
            "Two-Factor Authentication (2FA)",
            "দ্বি-স্তরীয় প্রমাণীকরণ (২FA)",
            "Hook: 'I already have a password — why do I need another step?' Because one step is not enough anymore.\n\nCore Explanation: Two-Factor Authentication (2FA) adds a second layer beyond just your password. Something you know (password) + something you have (phone, authenticator app, or hardware key). Even if your password is stolen, the attacker cannot log in without the second factor. SMS-based 2FA is better than nothing, but authenticator apps (Google Authenticator, Microsoft Authenticator) are more secure.\n\nBangladesh Example: Many bKash users have avoided account takeovers by enabling 2FA. In 2023, a phishing campaign stole hundreds of passwords, but those with 2FA enabled remained protected — the attackers couldn't complete the login.\n\nTakeaway: Turn on 2FA for every account that offers it — especially email, banking, and social media. It takes 30 seconds to set up but blocks 99% of automated attacks.",
            "Hook: 'পাসওয়ার্ড তো আছে — আরেকটি ধাপ কেন দরকার?' কারণ একটি ধাপ আর যথেষ্ট নয়।\n\nমূল ব্যাখ্যা: দ্বি-স্তরীয় প্রমাণীকরণ (২FA) পাসওয়ার্ডের পাশাপাশি আরেকটি স্তর যোগ করে। আপনি যা জানেন (পাসওয়ার্ড) + আপনার কাছে যা আছে (ফোন, অথেনটিকেটর অ্যাপ, বা হার্ডওয়্যার কী)। পাসওয়ার্ড চুরি গেলেও দ্বিতীয় ফ্যাক্টর ছাড়া আক্রমণকারী লগইন করতে পারে না। এসএমএস-ভিত্তিক ২FA কিছু না করার চেয়ে ভালো, তবে অথেনটিকেটর অ্যাপ (Google Authenticator, Microsoft Authenticator) বেশি নিরাপদ।\n\nবাংলাদেশের উদাহরণ: অনেক বিকাশ ব্যবহারকারী ২FA চালু করে অ্যাকাউন্ট দখল থেকে রক্ষা পেয়েছেন। ২০২৩ সালে একটি ফিশিং ক্যাম্পেইন শত শত পাসওয়ার্ড চুরি করে, কিন্তু যাদের ২FA চালু ছিল তারা সুরক্ষিত ছিলেন — আক্রমণকারীরা লগইন সম্পূর্ণ করতে পারেনি।\n\nসংক্ষিপ্ত শিক্ষা: যেসব অ্যাকাউন্টে ২FA দেওয়া আছে, সব জায়গায় চালু করুন — বিশেষ করে ইমেইল, ব্যাংকিং, ও সোশ্যাল মিডিয়া। সেটআপ করতে ৩০ সেকেন্ড লাগে, কিন্তু ৯৯% স্বয়ংক্রিয় আক্রমণ ব্লক করে।",
            5,
        ),
        (
            "Recognizing Phishing — Email, SMS, Social Media",
            "ফিশিং চেনার উপায় — ইমেইল, এসএমএস, সোশ্যাল মিডিয়া",
            "Hook: 'This looks official — they even used the logo!' That's exactly what phishers want you to think.\n\nCore Explanation: Phishing is any attempt to trick you into revealing personal information (passwords, PINs, OTPs, credit card numbers) by pretending to be a trusted entity. Classic signs: urgent language ('act now or your account will be closed'), a request for sensitive info (we never ask for your password), and a link that looks real but has subtle spelling differences (e.g., bkash-secure.com instead of bkash.com). Always verify by contacting the organization directly through official channels — never via the link in the suspicious message.\n\nBangladesh Example: A common SMS says 'Your bKash account has been locked. Click here to verify.' The link leads to a fake login page that steals your credentials. Real bKash will never ask you to click a link to unlock your account — you can check your account status directly in the app.\n\nTakeaway: Treat every unprompted request for personal information as suspicious. Verify independently, and never click links from unknown or unexpected messages.",
            "Hook: 'এটা অফিসিয়াল দেখাচ্ছে — এমনকি লোগোও ব্যবহার করেছে!' ফিশাররা ঠিক এটাই চায় আপনি ভাবুন।\n\nমূল ব্যাখ্যা: ফিশিং হলো কোনো বিশ্বস্ত সত্তা সেজে আপনার ব্যক্তিগত তথ্য (পাসওয়ার্ড, পিন, ওটিপি, ক্রেডিট কার্ড নম্বর) হাতিয়ে নেওয়ার চেষ্টা। সাধারণ চিহ্ন: জরুরি ভাষা ('এখনই করুন নইলে অ্যাকাউন্ট বন্ধ হবে'), সংবেদনশীল তথ্যের অনুরোধ (আমরা কখনো আপনার পাসওয়ার্ড চাই না), এবং লিংক যা দেখতে আসল মনে হলেও বানানে সামান্য ভিন্ন (যেমন bkash.com-এর বদলে bkash-secure.com)। সবসময় সরাসরি সংস্থার অফিসিয়াল চ্যানেলে যোগাযোগ করে যাচাই করুন — সন্দেহজনক মেসেজের লিংকে ক্লিক করবেন না।\n\nবাংলাদেশের উদাহরণ: একটি সাধারণ এসএমএস: 'আপনার বিকাশ অ্যাকাউন্ট লক হয়েছে। ভেরিফাই করতে এখানে ক্লিক করুন।' লিংকটি একটি ভুয়া লগইন পেজে নিয়ে যায় যা আপনার ক্রেডেনশিয়াল চুরি করে। আসল বিকাশ কখনো অ্যাকাউন্ট আনলক করতে লিংকে ক্লিক করতে বলে না — আপনি অ্যাপেই অ্যাকাউন্টের অবস্থা দেখতে পারেন।\n\nসংক্ষিপ্ত শিক্ষা: ব্যক্তিগত তথ্যের জন্য প্রতিটি অযাচিত অনুরোধকে সন্দেহজনক হিসেবে দেখুন। স্বাধীনভাবে যাচাই করুন, এবং অজানা বা অপ্রত্যাশিত মেসেজের লিংকে কখনো ক্লিক করবেন না।",
            5,
        ),
        (
            "Safe Social Media Habits",
            "নিরাপদ সোশ্যাল মিডিয়া অভ্যাস",
            "Hook: You post your birthday, your location, your workplace — you're giving attackers a detailed profile, for free.\n\nCore Explanation: Social media is a goldmine for attackers. Oversharing reveals your daily routines, family members, financial status, and even security questions (e.g., mother's maiden name). Attackers can use this information to craft personalized scams, guess passwords, or even impersonate you. Review your privacy settings (set to 'friends only' for sensitive posts), avoid sharing real-time location, and be wary of friend requests from strangers who seem too keen to know your personal details.\n\nBangladesh Example: A common scam: attackers create fake profiles of attractive people or 'job recruiters' to befriend you, then ask for money or personal details over time. In 2024, a group of fraudsters used Facebook to befriend hundreds of people, then scammed them out of lakhs of taka by pretending to be in trouble.\n\nTakeaway: Share with care. Ask: 'Would I want a stranger with bad intentions to know this?' If not, don't post it. Protect your privacy as you would protect your wallet.",
            "Hook: আপনি আপনার জন্মদিন, অবস্থান, কাজের জায়গা পোস্ট করেন — আপনি আক্রমণকারীদের বিনামূল্যে বিস্তারিত প্রোফাইল দিচ্ছেন।\n\nমূল ব্যাখ্যা: সোশ্যাল মিডিয়া আক্রমণকারীদের জন্য সোনার খনি। বেশি শেয়ার করলে আপনার দৈনন্দিন রুটিন, পরিবারের সদস্য, আর্থিক অবস্থা, এমনকি নিরাপত্তা প্রশ্ন (যেমন মায়ের আগের নাম) উন্মুক্ত হয়। আক্রমণকারীরা এই তথ্য ব্যবহার করে ব্যক্তিগত স্ক্যাম তৈরি করতে, পাসওয়ার্ড অনুমান করতে, বা এমনকি আপনার পরিচয় জাল করতে পারে। আপনার গোপনীয়তা সেটিংস পর্যালোচনা করুন (সংবেদনশীল পোস্ট 'শুধু বন্ধু' করুন), রিয়েল-টাইম অবস্থান শেয়ার করা এড়িয়ে চলুন, এবং অপরিচিতদের বন্ধু অনুরোধে সতর্ক থাকুন যারা আপনার ব্যক্তিগত তথ্য জানতে আগ্রহী দেখায়।\n\nবাংলাদেশের উদাহরণ: একটি সাধারণ স্ক্যাম: আক্রমণকারীরা আকর্ষণীয় মানুষ বা 'চাকরি প্রদানকারী' হিসাবে ভুয়া প্রোফাইল তৈরি করে আপনার সাথে বন্ধুত্ব করে, তারপর সময়ের সাথে টাকা বা ব্যক্তিগত তথ্য চায়। ২০২৪ সালে একদল জালিয়াত ফেসবুকে শত শত মানুষকে বন্ধু বানিয়ে তাদের কাছ থেকে প্রতারণার মাধ্যমে লক্ষ টাকা হাতিয়ে নেয়।\n\nসংক্ষিপ্ত শিক্ষা: সাবধানে শেয়ার করুন। নিজেকে প্রশ্ন করুন: 'খারাপ উদ্দেশ্যের কোনো অপরিচিত মানুষ এটি জানলে আমি কি স্বাচ্ছন্দ্য বোধ করব?' যদি না হয়, পোস্ট করবেন না। আপনার গোপনীয়তাকে যেমন আপনার মানিব্যাগ রক্ষা করেন সেভাবে রক্ষা করুন।",
            5,
        ),
        (
            "Safe QR & Mobile Payment Practices",
            "নিরাপদ কিউআর ও মোবাইল পেমেন্ট অভ্যাস",
            "Hook: 'Just scan this QR code and pay.' — a simple act that can drain your bank account if you're not careful.\n\nCore Explanation: QR code scams work by replacing legitimate QR codes with fake ones that redirect payments to the scammer's account. Or, scammers send you a QR code that, when scanned, initiates a payment request from you to them. Always verify the QR code's destination before scanning. For mobile payments like bKash and Nagad, never share your PIN or OTP with anyone — even if they claim to be customer support. Only use official apps and avoid scanning random QR codes in public places.\n\nBangladesh Example: In 2023, several small shop owners lost money when scammers pasted fake QR stickers over their original ones, diverting customer payments to their own accounts. Customers scanning the fake QR codes unknowingly paid the scammer instead of the shop.\n\nTakeaway: Always check the QR code's payer/payee details before confirming any transaction. Trust your app's official interface, not the printed paper. And never, ever share your PIN or OTP with anyone.",
            "Hook: 'শুধু এই কিউআর কোড স্ক্যান করে পেমেন্ট করুন।' — একটি সহজ কাজ যা আপনার ব্যাংক অ্যাকাউন্ট খালি করতে পারে যদি আপনি সতর্ক না হন।\n\nমূল ব্যাখ্যা: কিউআর কোড স্ক্যাম আসল কোডের জায়গায় ভুয়া কোড লাগিয়ে কাজ করে যা পেমেন্ট স্ক্যামারের অ্যাকাউন্টে পুনর্নির্দেশ করে। অথবা, স্ক্যামাররা আপনাকে একটি কিউআর কোড পাঠায় যা স্ক্যান করলে আপনার কাছ থেকে তাদের কাছে পেমেন্ট অনুরোধ শুরু করে। স্ক্যান করার আগে কিউআর কোডের গন্তব্য যাচাই করুন। মোবাইল পেমেন্ট যেমন বিকাশ ও নগদ-এর জন্য, কখনো আপনার পিন বা ওটিপি কাউকে বলবেন না — এমনকি তারা গ্রাহক সেবা বলে দাবি করলেও। শুধু অফিসিয়াল অ্যাপ ব্যবহার করুন এবং পাবলিক জায়গায় এলোমেলো কিউআর কোড স্ক্যান করা এড়িয়ে চলুন।\n\nবাংলাদেশের উদাহরণ: ২০২৩ সালে কিছু ছোট দোকানি টাকা হারান যখন স্ক্যামাররা তাদের আসল কিউআর কোডের ওপর ভুয়া স্টিকার লাগিয়ে দেয়, যার ফলে ক্রেতাদের পেমেন্ট তাদের নিজের অ্যাকাউন্টে চলে যেত। ক্রেতারা ভুয়া কোড স্ক্যান করে অজান্তেই দোকানের বদলে স্ক্যামারকে টাকা পাঠাতেন।\n\nসংক্ষিপ্ত শিক্ষা: কোনো লেনদেন নিশ্চিত করার আগে কিউআর কোডের প্রেরক/প্রাপক বিবরণ সবসময় যাচাই করুন। অ্যাপের অফিসিয়াল ইন্টারফেস বিশ্বাস করুন, ছাপানো কাগজ নয়। এবং কখনোই কাউকে আপনার পিন বা ওটিপি বলবেন না।",
            5,
        ),
        (
            "Public Wi-Fi Risks",
            "পাবলিক ওয়াই-ফাই ঝুঁকি",
            "Hook: Free Wi-Fi — the biggest temptation, and the biggest risk.\n\nCore Explanation: Public Wi-Fi networks are often unencrypted, meaning anyone on the same network can intercept your data (passwords, emails, messages) with minimal effort. Attackers can set up fake 'free Wi-Fi' hotspots to capture everything you do. Always assume public Wi-Fi is hostile. Use a VPN to encrypt your traffic, avoid logging into sensitive accounts (banking, email) on public networks, and turn off automatic Wi-Fi connection to avoid unknowingly connecting to rogue networks.\n\nBangladesh Example: At a popular Dhaka café, attackers set up a Wi-Fi network named 'Cafe_Free_WiFi' that looked legitimate. Customers connected, and attackers captured their social media and email credentials in real-time. Many victims reported compromised accounts shortly after.\n\nTakeaway: Treat public Wi-Fi like a public phone booth — assume others can hear your conversation. Use a VPN, and save sensitive activities for your home or cellular network.",
            "Hook: ফ্রি ওয়াই-ফাই — সবচেয়ে বড় প্রলোভন, এবং সবচেয়ে বড় ঝুঁকি।\n\nমূল ব্যাখ্যা: পাবলিক ওয়াই-ফাই নেটওয়ার্কগুলো প্রায়ই এনক্রিপ্টেড হয় না, অর্থাৎ একই নেটওয়ার্কে থাকা যে কেউ খুব সহজে আপনার ডেটা (পাসওয়ার্ড, ইমেইল, মেসেজ) আটকাতে পারে। আক্রমণকারীরা ভুয়া 'ফ্রি ওয়াই-ফাই' হটস্পট তৈরি করে যা আপনি যা করেন তা ধারণ করতে পারে। সবসময় পাবলিক ওয়াই-ফাইকে শত্রুর মতো বিবেচনা করুন। আপনার ট্রাফিক এনক্রিপ্ট করতে VPN ব্যবহার করুন, পাবলিক নেটওয়ার্কে সংবেদনশীল অ্যাকাউন্টে (ব্যাংকিং, ইমেইল) লগইন এড়িয়ে চলুন, এবং নিজে নিজে ওয়াই-ফাই কানেক্ট হওয়ার সুইচ অফ রাখুন যাতে অজান্তে প্রতারণামূলক নেটওয়ার্কে কানেক্ট না হন।\n\nবাংলাদেশের উদাহরণ: ঢাকার একটি জনপ্রিয় ক্যাফেতে আক্রমণকারীরা 'Cafe_Free_WiFi' নামে একটি ওয়াই-ফাই নেটওয়ার্ক স্থাপন করে যা দেখতে বৈধ মনে হচ্ছিল। গ্রাহকরা সংযুক্ত হন, এবং আক্রমণকারীরা তাদের সোশ্যাল মিডিয়া ও ইমেইল ক্রেডেনশিয়াল রিয়েল-টাইমে আটক করে। অনেক ভুক্তভোগী শীঘ্রই নিজেদের অ্যাকাউন্ট আপোস হওয়ার কথা জানান।\n\nসংক্ষিপ্ত শিক্ষা: পাবলিক ওয়াই-ফাইকে পাবলিক ফোন বুথের মতো বিবেচনা করুন — ধরে নিন অন্যরা আপনার কথোপকথন শুনতে পারে। VPN ব্যবহার করুন, এবং সংবেদনশীল কাজগুলোর জন্য নিজের হোম নেটওয়ার্ক বা মোবাইল ডেটা ব্যবহার করুন।",
            5,
        ),
        # ---- Tier 2 (6) ----
        (
            "Anatomy of a Real Scam Message",
            "আসল স্ক্যাম মেসেজের অ্যানাটমি",
            "Hook: 'Congratulations! You've won 50,000 BDT! Click here to claim.' — this message alone has ruined thousands of lives.\n\nCore Explanation: A typical scam SMS has a clear structure: (1) A hook (unexpected prize or threat), (2) Urgent action ('within 24 hours'), (3) A link or phone number to contact. Each piece is designed to bypass your rational thinking by triggering fear or greed. Understanding this anatomy helps you spot scams immediately.\n\nBangladesh Example: In 2024, a viral SMS claimed 'Your bKash account has been compromised. Call this number to secure it.' Thousands called, gave their OTPs, and lost money. The message looked official but had a personal mobile number instead of the official helpline.\n\nTakeaway: If a message brings strong emotion (fear or excitement) + asks for action (click, call, reply) — stop. Verify independently. Don't be the 1% who falls for it.",
            "Hook: 'অভিনন্দন! আপনি ৫০,০০০ টাকা জিতেছেন! দাবি করতে এখানে ক্লিক করুন।' — এই একটি মেসেজ হাজার হাজার মানুষের জীবন ধ্বংস করেছে।\n\nমূল ব্যাখ্যা: একটি সাধারণ স্ক্যাম এসএমএস-এর একটি পরিষ্কার কাঠামো থাকে: (১) একটি হুক (অপ্রত্যাশিত পুরস্কার বা হুমকি), (২) জরুরি পদক্ষেপ ('২৪ ঘণ্টার মধ্যে'), (৩) একটি লিংক বা ফোন নম্বর। প্রতিটি অংশ আপনার যুক্তিবোধকে bypass করে ভয় বা লোভ সক্রিয় করার জন্য ডিজাইন করা হয়েছে। এই অ্যানাটমি বোঝা আপনাকে সঙ্গে সঙ্গে স্ক্যাম চিনতে সাহায্য করে।\n\nবাংলাদেশের উদাহরণ: ২০২৪ সালে একটি ভাইরাল এসএমএস দাবি করেছিল 'আপনার বিকাশ অ্যাকাউন্ট আপোস হয়েছে। এই নম্বরে কল করে নিরাপদ করুন।' হাজার হাজার মানুষ কল করে তাদের ওটিপি দিয়েছে এবং টাকা হারিয়েছে। মেসেজটি অফিসিয়াল দেখালেও অফিসিয়াল হেল্পলাইনের বদলে ব্যক্তিগত মোবাইল নম্বর ব্যবহার করা হয়েছিল।\n\nসংক্ষিপ্ত শিক্ষা: যদি কোনো মেসেজে শক্তিশালী আবেগ (ভয় বা উৎপাদনা) + কাজ করার অনুরোধ (ক্লিক, কল, রিপ্লাই) থাকে — থামুন। স্বাধীনভাবে যাচাই করুন। যে ১% ফাঁদে পড়ে তাদের একজন হবেন না।",
            6,
        ),
        (
            "Social Engineering Tactics",
            "সোশ্যাল ইঞ্জিনিয়ারিং কৌশল",
            "Hook: 'I'm calling from the bank. We've detected fraud on your account.' — they know exactly what to say to make you panic.\n\nCore Explanation: Social engineering is the art of manipulating people into breaking normal security procedures. Attackers exploit four primary emotions: (1) Urgency — 'Act now or lose everything', (2) Authority — 'I'm from the government/bank', (3) Fear — 'Your account will be locked', (4) Greed — 'You've won a prize'. They don't hack computers; they hack human psychology.\n\nBangladesh Example: Scammers call older family members pretending to be a grandson in trouble, urgently needing money. The voice might even be AI-generated to sound like the real person. Without verification, families have sent lakhs of taka to fraudsters.\n\nTakeaway: Legitimate institutions never ask for sensitive info over the phone or through unsolicited messages. When in doubt, hang up and call back using a verified number from the official website or app.",
            "Hook: 'আমি ব্যাংক থেকে বলছি। আপনার অ্যাকাউন্টে প্রতারণা সনাক্ত হয়েছে।' — তারা জানে ঠিক কী বললে আপনি প্যানিক করবেন।\n\nমূল ব্যাখ্যা: সোশ্যাল ইঞ্জিনিয়ারিং হলো স্বাভাবিক নিরাপত্তা প্রক্রিয়া ভঙ্গ করতে মানুষকে ম্যানিপুলেট করার শিল্প। আক্রমণকারীরা চারটি প্রাথমিক আবেগকে কাজে লাগায়: (১) জরুরি অবস্থা — 'এখনই করুন নইলে সব হারাবেন', (২) কর্তৃত্ব — 'আমি সরকার/ব্যাংক থেকে বলছি', (৩) ভয় — 'আপনার অ্যাকাউন্ট লক হয়ে যাবে', (৪) লোভ — 'আপনি পুরস্কার জিতেছেন'। তারা কম্পিউটার হ্যাক করে না; তারা মানুষের মনস্তত্ত্ব হ্যাক করে।\n\nবাংলাদেশের উদাহরণ: স্ক্যামাররা বয়স্ক পরিবারের সদস্যদের ডেকে নিজেদের নাতি বলে পরিচয় দিয়ে জরুরি টাকার জন্য কাঁদে। কণ্ঠস্বর এমনকি AI দিয়ে তৈরি করা হতে পারে যা আসল মানুষের মতো শোনায়। যাচাই না করেই পরিবারগুলি জালিয়াতদের কাছে লক্ষ টাকা পাঠিয়ে দিয়েছে।\n\nসংক্ষিপ্ত শিক্ষা: বৈধ প্রতিষ্ঠান কখনো ফোনে বা অযাচিত মেসেজের মাধ্যমে সংবেদনশীল তথ্য চায় না। সন্দেহ হলে ফোন কেটে অফিসিয়াল ওয়েবসাইট বা অ্যাপ থেকে যাচাইকৃত নম্বরে আবার কল করুন।",
            6,
        ),
        (
            "Fake Job Scams in Bangladesh",
            "বাংলাদেশে ভুয়া চাকরির স্ক্যাম",
            "Hook: 'We are offering 80,000 BDT/month for a work-from-home position. No experience needed!' — sounds too good to be true because it is.\n\nCore Explanation: Fake job scams target desperate job seekers. They follow a pattern: (1) Unrealistic salary for minimal experience, (2) A request for an 'advance fee' (for training, visa, or processing), (3) Urgent hiring without a proper interview, (4) Vague company details. Real companies pay you — they don't ask you to pay them.\n\nBangladesh Example: In 2023, a fake NGO promised rural women a salary of 40,000 BDT/month for part-time work. They required a 5,000 BDT 'registration fee'. Thousands applied, paid the fee, and never received a job. The scam made crores of taka.\n\nTakeaway: If you have to pay to get a job, it's not a job — it's a scam. Research the company independently and never send money to an employer.",
            "Hook: 'আমরা ৮০,০০০ টাকা/মাস দিচ্ছি কাজ-থেকে-বাড়ির পদের জন্য। কোন অভিজ্ঞতা লাগবে না!' — খুব ভালো মনে হচ্ছে সত্যি হওয়ার জন্য, কারণ এটা সত্যি না।\n\nমূল ব্যাখ্যা: ভুয়া চাকরির স্ক্যাম বেকার চাকরিপ্রার্থীদের টার্গেট করে। এদের একটি প্যাটার্ন থাকে: (১) ন্যূনতম অভিজ্ঞতার জন্য অবাস্তব বেতন, (২) 'অগ্রিম ফি' (প্রশিক্ষণ, ভিসা, বা প্রক্রিয়াকরণের জন্য) চাওয়া, (৩) সঠিক ইন্টারভিউ ছাড়া জরুরি নিয়োগ, (৪) অস্পষ্ট কোম্পানি বিবরণ। প্রকৃত কোম্পানি আপনাকে বেতন দেয় — তারা আপনাকে তাদের টাকা দিতে বলে না।\n\nবাংলাদেশের উদাহরণ: ২০২৩ সালে একটি ভুয়া এনজিও গ্রামীণ নারীদের পার্টটাইম কাজের জন্য ৪০,০০০ টাকা/মাস বেতনের প্রতিশ্রুতি দেয়। তারা ৫,০০০ টাকা 'রেজিস্ট্রেশন ফি' দাবি করে। হাজার হাজার মানুষ আবেদন করে ফি দেয় এবং কখনো চাকরি পায়নি। স্ক্যামটি কোটি টাকা করেছে।\n\nসংক্ষিপ্ত শিক্ষা: চাকরি পেতে যদি টাকা দিতে হয়, সেটা চাকরি না — স্ক্যাম। কোম্পানি সম্পর্কে স্বাধীনভাবে গবেষণা করুন এবং নিয়োগকর্তাকে কখনো টাকা পাঠাবেন না।",
            6,
        ),
        (
            "Malware Types Explained Simply",
            "ম্যালওয়্যারের ধরন সহজ ভাষায়",
            "Hook: 'Virus? Malware? Ransomware? Aren't they all the same?' — no, and knowing the difference could save your data.\n\nCore Explanation: Malware is any malicious software. Key types: (1) Virus — attaches to clean files and spreads when you run them. (2) Ransomware — locks your files and demands payment to unlock them. (3) Spyware — secretly monitors your activity (keystrokes, passwords). (4) Trojan — disguises itself as a legitimate app but does something malicious. Each type behaves differently and requires different defenses.\n\nBangladesh Example: A wave of ransomware hit small businesses in Dhaka in 2024. They received emails with fake invoices. Opening the attachment encrypted their files. The attackers demanded 50,000 BDT in Bitcoin to restore access. Many paid, but some lost everything because the decryption never worked.\n\nTakeaway: Don't download files from unknown sources, keep backups of important data, and use antivirus software that detects multiple types of malware.",
            "Hook: 'ভাইরাস? ম্যালওয়্যার? র্যানসমওয়্যার? সব কি একই?' — না, এবং পার্থক্য জানা আপনার ডেটা বাঁচাতে পারে।\n\nমূল ব্যাখ্যা: ম্যালওয়্যার হলো যেকোনো ক্ষতিকর সফটওয়্যার। প্রধান ধরন: (১) ভাইরাস — পরিষ্কার ফাইলের সাথে সংযুক্ত হয় এবং আপনি যখন চালান তখন ছড়ায়। (২) র্যানসমওয়্যার — আপনার ফাইল লক করে এবং আনলক করতে টাকা দাবি করে। (৩) স্পাইওয়্যার — গোপনে আপনার কার্যকলাপ (কীস্ট্রোক, পাসওয়ার্ড) পর্যবেক্ষণ করে। (৪) ট্রোজান — নিজেকে একটি বৈধ অ্যাপ হিসাবে ছদ্মবেশ ধারণ করে কিন্তু ক্ষতিকর কিছু করে। প্রতিটি ধরন ভিন্ন আচরণ করে এবং ভিন্ন প্রতিরক্ষা প্রয়োজন।\n\nবাংলাদেশের উদাহরণ: ২০২৪ সালে ঢাকার ছোট ব্যবসাগুলিতে র্যানসমওয়্যারের একটি ঢেউ আঘাত হানে। তারা ভুয়া ইনভয়েস সহ ইমেইল পায়। অ্যাটাচমেন্ট খোলার সাথে সাথে তাদের ফাইল এনক্রিপ্ট হয়ে যায়। আক্রমণকারীরা অ্যাক্সেস পুনরুদ্ধারের জন্য বিটকয়েনে ৫০,০০০ টাকা দাবি করে। অনেকে টাকা দিয়েছেন, কিন্তু ডিক্রিপশন কখনো কাজ করেনি বলে অনেকে সব হারিয়েছেন।\n\nসংক্ষিপ্ত শিক্ষা: অজানা উৎস থেকে ফাইল ডাউনলোড করবেন না, গুরুত্বপূর্ণ ডেটার ব্যাকআপ রাখুন, এবং একাধিক ধরনের ম্যালওয়্যার শনাক্ত করে এমন অ্যান্টিভাইরাস সফটওয়্যার ব্যবহার করুন।",
            6,
        ),
        (
            "SIM Swap & Account Takeover",
            "সিম সোয়াপ ও অ্যাকাউন্ট দখল",
            "Hook: 'I'm not getting any signal on my phone.' — you might be the victim of a SIM swap attack without even knowing it.\n\nCore Explanation: SIM swap occurs when an attacker tricks your mobile operator into transferring your phone number to their SIM card. Once they control your number, they can receive OTPs and reset passwords for your bank accounts, social media, and email. They usually get your personal info (NID, birth date) through previous phishing attacks.\n\nBangladesh Example: In 2024, a high-profile case involved a businessman who lost 2 million BDT after fraudsters used his leaked NID to request a SIM replacement from the operator. They reset his bKash and bank passwords using the OTPs sent to their SIM.\n\nTakeaway: If your phone suddenly loses signal, call your operator immediately. Enable 2FA using authenticator apps (not SMS) for critical accounts. Never share your NID or personal details online carelessly.",
            "Hook: 'আমার ফোনে কোনো সিগন্যাল আসছে না।' — আপনি সিম সোয়াপ আক্রমণের শিকার হয়েছেন অজান্তেই।\n\nমূল ব্যাখ্যা: সিম সোয়াপ ঘটে যখন একজন আক্রমণকারী আপনার মোবাইল অপারেটরকে প্রতারণা করে আপনার ফোন নম্বর তাদের সিমে স্থানান্তর করতে। একবার তারা আপনার নম্বর নিয়ন্ত্রণ করলে, তারা ওটিপি পেতে পারে এবং আপনার ব্যাংক অ্যাকাউন্ট, সোশ্যাল মিডিয়া, ও ইমেইলের পাসওয়ার্ড রিসেট করতে পারে। তারা সাধারণত পূর্ববর্তী ফিশিং আক্রমণের মাধ্যমে আপনার ব্যক্তিগত তথ্য (এনআইডি, জন্ম তারিখ) পায়।\n\nবাংলাদেশের উদাহরণ: ২০২৪ সালে একটি উচ্চ-profile ঘটনায় একজন ব্যবসায়ী ২০ লাখ টাকা হারান যখন জালিয়াতরা তার লিক হওয়া এনআইডি ব্যবহার করে অপারেটরের কাছে সিম প্রতিস্থাপনের অনুরোধ করে। তারা তাদের সিমে পাঠানো ওটিপি ব্যবহার করে তার বিকাশ ও ব্যাংকের পাসওয়ার্ড রিসেট করে।\n\nসংক্ষিপ্ত শিক্ষা: আপনার ফোন হঠাৎ সিগন্যাল হারালে সাথে সাথে অপারেটরকে কল করুন। গুরুত্বপূর্ণ অ্যাকাউন্টের জন্য এসএমএস-এর বদলে অথেনটিকেটর অ্যাপ ব্যবহার করে ২FA চালু করুন। কখনো আপনার এনআইডি বা ব্যক্তিগত বিবরণ অনলাইনে অসাবধানে শেয়ার করবেন না।",
            6,
        ),
        (
            "Bangladesh's Digital Security Act & Reporting Cybercrime",
            "বাংলাদেশের ডিজিটাল নিরাপত্তা আইন ও সাইবারক্রাইম রিপোর্টিং",
            "Hook: 'I've been scammed. Who do I even tell?' — you're not alone, and there is a proper channel.\n\nCore Explanation: Bangladesh has a legal framework to address cybercrime, primarily the Digital Security Act (2018). Under this, you can report incidents (financial fraud, hacking, defamation) to the Cyber Crime Investigation Division of the Police. They have a dedicated hotline and online portal. The government also runs awareness campaigns to help citizens protect themselves.\n\nBangladesh Example: In 2024, a university student lost 10,000 BDT to a fake bKash agent. She reported it via the national helpline (999) and the Cyber Crime unit traced the scammer's account and froze it. The money was returned within a week.\n\nTakeaway: Document everything (screenshots, transaction IDs, phone numbers). Report immediately via 999 or the Cyber Crime portal. The law is on your side, but you have to act fast.",
            "Hook: 'আমি স্ক্যামের শিকার হয়েছি। আমি কাকে বলব?' — আপনি একা নন, এবং একটি সঠিক চ্যানেল রয়েছে।\n\nমূল ব্যাখ্যা: বাংলাদেশে সাইবারক্রাইম মোকাবেলায় একটি আইনি কাঠামো রয়েছে, প্রধানত ডিজিটাল নিরাপত্তা আইন (২০১৮)। এর অধীনে, আপনি পুলিশের সাইবার ক্রাইম ইনভেস্টিগেশন বিভাগে ঘটনা (আর্থিক প্রতারণা, হ্যাকিং, মানহানি) রিপোর্ট করতে পারেন। তাদের একটি ডেডিকেটেড হেল্পলাইন এবং অনলাইন পোর্টাল রয়েছে। সরকার নাগরিকদের নিজেদের রক্ষায় সহায়তা করার জন্য সচেতনতামূলক প্রচারণাও চালায়।\n\nবাংলাদেশের উদাহরণ: ২০২৪ সালে একজন বিশ্ববিদ্যালয়ের শিক্ষার্থী ভুয়া বিকাশ এজেন্টের কাছে ১০,০০০ টাকা হারায়। সে জাতীয় হেল্পলাইনে (৯৯৯) রিপোর্ট করে এবং সাইবার ক্রাইম ইউনিট স্ক্যামারের অ্যাকাউন্ট ট্রেস করে ফ্রিজ করে দেয়। এক সপ্তাহের মধ্যে টাকা ফেরত দেওয়া হয়।\n\nসংক্ষিপ্ত শিক্ষা: সবকিছু নথিভুক্ত করুন (স্ক্রিনশট, লেনদেন আইডি, ফোন নম্বর)। ৯৯৯ বা সাইবার ক্রাইম পোর্টালে তাৎক্ষণিক রিপোর্ট করুন। আইন আপনার পক্ষে, কিন্তু আপনাকে দ্রুত কাজ করতে হবে।",
            6,
        ),
        # ---- Tier 3 (6) ----
        (
            "The Cyber Kill Chain",
            "সাইবার কিল চেইন",
            "Hook: 'How do hackers even break into big companies?' — they follow a step-by-step process, just like a heist movie.\n\nCore Explanation: The Cyber Kill Chain, developed by Lockheed Martin, breaks down a cyber attack into 7 stages: (1) Reconnaissance — gathering info about the target, (2) Weaponization — creating a payload (e.g., a malicious attachment), (3) Delivery — sending the payload (email, USB), (4) Exploitation — executing the attack, (5) Installation — installing malware, (6) Command & Control — establishing a connection back to the attacker, (7) Actions on Objectives — stealing data, encrypting files, etc. Defenders can stop an attack at any stage.\n\nBangladesh Example: A local bank was breached when attackers sent a spear-phishing email to an employee. The employee clicked the link (stage 3), which installed malware (stage 5), and the attackers accessed the internal network (stage 7). The bank's security team caught it at stage 6 and disconnected the server.\n\nTakeaway: Security isn't about building a perfect wall; it's about breaking the chain. Every time you're suspicious of an email or avoid clicking an unknown link, you're breaking a link in that chain.",
            "Hook: 'হ্যাকাররা কীভাবে বড় কোম্পানিতে ঢোকে?' — তারা ধাপে ধাপে কাজ করে, ঠিক সিনেমার চুরির মতো।\n\nমূল ব্যাখ্যা: সাইবার কিল চেইন, যা Lockheed Martin তৈরি করেছে, একটি সাইবার আক্রমণকে ৭টি ধাপে ভাগ করে: (১) রিকনেসান্স — টার্গেট সম্পর্কে তথ্য সংগ্রহ, (২) উইপোনাইজেশন — একটি পেলোড তৈরি (যেমন ক্ষতিকর অ্যাটাচমেন্ট), (৩) ডেলিভারি — পেলোড পাঠানো (ইমেইল, ইউএসবি), (৪) এক্সপ্লয়টেশন — আক্রমণ চালানো, (৫) ইনস্টলেশন — ম্যালওয়্যার ইনস্টল, (৬) কমান্ড ও কন্ট্রোল — আক্রমণকারীর সাথে সংযোগ স্থাপন, (৭) অ্যাকশনস অন অবজেক্টিভস — ডেটা চুরি, ফাইল এনক্রিপ্ট ইত্যাদি। প্রতিরক্ষাকারীরা যেকোনো ধাপে আক্রমণ থামাতে পারে।\n\nবাংলাদেশের উদাহরণ: একটি স্থানীয় ব্যাংক হ্যাক হয় যখন আক্রমণকারীরা একজন কর্মচারীকে স্পিয়ার-ফিশিং ইমেইল পাঠায়। কর্মচারী লিংকে ক্লিক করে (ধাপ ৩), যা ম্যালওয়্যার ইনস্টল করে (ধাপ ৫), এবং আক্রমণকারীরা অভ্যন্তরীণ নেটওয়ার্কে প্রবেশ করে (ধাপ ৭)। ব্যাংকের নিরাপত্তা দল ধাপ ৬-এ ধরে ফেলে এবং সার্ভার সংযোগ বিচ্ছিন্ন করে।\n\nসংক্ষিপ্ত শিক্ষা: নিরাপত্তা মানে নিখুঁত প্রাচীর তৈরি করা নয়; এটা চেইন ভাঙার ব্যাপার। আপনি যখন কোনো ইমেইল সন্দেহ করেন বা অজানা লিংকে ক্লিক করা এড়িয়ে যান, তখন আপনি সেই চেইনের একটি লিংক ভাঙছেন।",
            7,
        ),
        (
            "OWASP Top 10, Explained for Non-Developers",
            "OWASP টপ ১০, নন-ডেভেলপারদের জন্য সহজ ভাষায়",
            "Hook: 'OWASP sounds like a weird tech acronym.' — but it's a list of the biggest security risks on the web, and knowing them helps you stay safe.\n\nCore Explanation: The Open Worldwide Application Security Project (OWASP) publishes a top 10 list of web security risks. Key ones you should know: (1) Broken Access Control — users can access things they shouldn't (like seeing someone else's bank balance), (2) Cryptographic Failures — weak passwords or unencrypted data, (3) Injection — attackers trick the system into executing malicious code (like SQL injection), (4) Security Misconfiguration — leaving default passwords or unpatched systems, (5) Cross-Site Scripting (XSS) — attackers inject scripts into websites you trust.\n\nBangladesh Example: A popular e-commerce site in Bangladesh suffered from broken access control in 2023. A user accidentally discovered they could change the 'user_id' parameter in the URL and see other customers' order details, including phone numbers and addresses. The flaw was fixed only after several customers complained about privacy breaches.\n\nTakeaway: These aren't just developer problems — when you use a site, be aware that these vulnerabilities exist. Use strong unique passwords, and avoid sharing sensitive information on unencrypted sites (look for https://).",
            "Hook: 'OWASP শুনতে অদ্ভুত টেক শব্দ মনে হয়।' — কিন্তু এটি ওয়েবের সবচেয়ে বড় নিরাপত্তা ঝুঁকির একটি তালিকা, এবং এগুলো জানা আপনাকে নিরাপদ রাখতে সাহায্য করে।\n\nমূল ব্যাখ্যা: OWASP ওয়েব নিরাপত্তা ঝুঁকির একটি শীর্ষ ১০ তালিকা প্রকাশ করে। আপনার জানা উচিত এমন কিছু গুরুত্বপূর্ণ: (১) ভাঙা অ্যাক্সেস কন্ট্রোল — ব্যবহারকারীরা এমন জিনিস অ্যাক্সেস করতে পারে যা তাদের উচিত নয় (যেমন অন্য কারো ব্যাংক ব্যালেন্স দেখা), (২) ক্রিপ্টোগ্রাফিক ফেইলিউর — দুর্বল পাসওয়ার্ড বা এনক্রিপ্ট না করা ডেটা, (৩) ইনজেকশন — আক্রমণকারীরা সিস্টেমকে ক্ষতিকর কোড এক্সিকিউট করতে বাধ্য করে (যেমন SQL ইনজেকশন), (৪) নিরাপত্তা মিসকনফিগারেশন — ডিফল্ট পাসওয়ার্ড বা প্যাচ না করা সিস্টেম রেখে দেওয়া, (৫) ক্রস-সাইট স্ক্রিপ্টিং (XSS) — আক্রমণকারীরা আপনি যে সাইটগুলিতে বিশ্বাস করেন সেখানে স্ক্রিপ্ট ইনজেক্ট করে।\n\nবাংলাদেশের উদাহরণ: ২০২৩ সালে বাংলাদেশের একটি জনপ্রিয় ই-কমার্স সাইট ভাঙা অ্যাক্সেস কন্ট্রোলের শিকার হয়। একজন ব্যবহারকারী আবিষ্কার করেন যে তারা URL-এ 'user_id' প্যারামিটার পরিবর্তন করে অন্য গ্রাহকদের অর্ডারের বিবরণ (ফোন নম্বর ও ঠিকানা সহ) দেখতে পাচ্ছেন। বেশ কয়েকজন গ্রাহক গোপনীয়তা লঙ্ঘনের অভিযোগ করার পর ত্রুটিটি ঠিক করা হয়।\n\nসংক্ষিপ্ত শিক্ষা: এগুলো শুধু ডেভেলপারদের সমস্যা না — আপনি যখন কোনো সাইট ব্যবহার করেন, সচেতন থাকুন যে এই দুর্বলতাগুলো বিদ্যমান। শক্তিশালী ইউনিক পাসওয়ার্ড ব্যবহার করুন, এবং এনক্রিপ্ট না করা সাইটে (https:// খোঁজুন) সংবেদনশীল তথ্য শেয়ার করা এড়িয়ে চলুন।",
            7,
        ),
        (
            "Understanding Encryption",
            "এনক্রিপশন বোঝা",
            "Hook: 'https://? That little padlock means my connection is safe, right?' — mostly, but encryption is deeper than that.\n\nCore Explanation: Encryption scrambles data so only the intended recipient can read it. Two main types: (1) Symmetric — same key to encrypt and decrypt (like a password), (2) Asymmetric — two keys (public and private). HTTPS uses TLS to encrypt the connection between your browser and the website. End-to-end encryption (like in WhatsApp) ensures even the service provider can't read your messages.\n\nBangladesh Example: Many Bangladeshi users don't know that unencrypted websites (http://) can be intercepted by anyone on the same public Wi-Fi. In 2023, a café in Dhaka had a rogue Wi-Fi that captured login credentials from visitors using unprotected sites.\n\nTakeaway: Always look for https:// before entering personal info. Use end-to-end encrypted apps for sensitive communication. Encryption is your invisible shield.",
            "Hook: 'https://? সেই ছোট্ট প্যাডলক মানে আমার সংযোগ নিরাপদ, তাই না?' — বেশিরভাগই, কিন্তু এনক্রিপশন এর চেয়েও গভীর।\n\nমূল ব্যাখ্যা: এনক্রিপশন ডেটা স্ক্র্যাম্বল করে যাতে শুধু উদ্দিষ্ট প্রাপক তা পড়তে পারে। দুটি প্রধান ধরন: (১) সিমেট্রিক — এনক্রিপ্ট ও ডিক্রিপ্টের জন্য একই কী (পাসওয়ার্ডের মতো), (২) অ্যাসিমেট্রিক — দুটি কী (পাবলিক ও প্রাইভেট)। HTTPS আপনার ব্রাউজার ও ওয়েবসাইটের মধ্যে সংযোগ এনক্রিপ্ট করতে TLS ব্যবহার করে। এন্ড-টু-এন্ড এনক্রিপশন (যেমন হোয়াটসঅ্যাপে) নিশ্চিত করে যে পরিষেবা প্রদানকারীও আপনার মেসেজ পড়তে পারে না।\n\nবাংলাদেশের উদাহরণ: অনেক বাংলাদেশি ব্যবহারকারী জানেন না যে এনক্রিপ্ট না করা ওয়েবসাইট (http://) একই পাবলিক ওয়াই-ফাইতে থাকা যে কেউ আটকাতে পারে। ২০২৩ সালে ঢাকার একটি ক্যাফেতে একটি প্রতারণামূলক ওয়াই-ফাই ছিল যা দর্শনার্থীদের অরক্ষিত সাইট ব্যবহার করা থেকে লগইন ক্রেডেনশিয়াল ক্যাপচার করত।\n\nসংক্ষিপ্ত শিক্ষা: ব্যক্তিগত তথ্য দেওয়ার আগে সবসময় https:// খুঁজুন। সংবেদনশীল যোগাযোগের জন্য এন্ড-টু-এন্ড এনক্রিপ্টেড অ্যাপ ব্যবহার করুন। এনক্রিপশন আপনার অদৃশ্য ঢাল।",
            7,
        ),
        (
            "Intro to Threat Modeling (STRIDE)",
            "থ্রেট মডেলিং (STRIDE)-এর ভূমিকা",
            "Hook: 'How do security professionals think about risks?' — they use a structured approach called threat modeling.\n\nCore Explanation: STRIDE is a mnemonic for threat types: (1) Spoofing — pretending to be someone else (phishing), (2) Tampering — modifying data (like changing a transaction amount), (3) Repudiation — denying you did something (no audit trail), (4) Information Disclosure — leaking sensitive data, (5) Denial of Service — crashing a system, (6) Elevation of Privilege — getting admin access. Thinking in these terms helps you spot threats before they happen.\n\nBangladesh Example: A government website in Bangladesh failed to log access attempts (repudiation). When someone posted fake information, administrators couldn't prove who did it, making it impossible to hold anyone accountable.\n\nTakeaway: You don't need to be a professional to think like one. Ask: 'Who could fake my identity? Where is my data exposed?' — that's threat modeling for everyday life.",
            "Hook: 'নিরাপত্তা পেশাদাররা কীভাবে ঝুঁকি নিয়ে চিন্তা করে?' — তারা থ্রেট মডেলিং নামে একটি কাঠামোবদ্ধ পদ্ধতি ব্যবহার করে।\n\nমূল ব্যাখ্যা: STRIDE হল হুমকির প্রকারের জন্য একটি স্মারক: (১) স্পুফিং — অন্য কারও সেজে ফাঁকি দেওয়া (ফিশিং), (২) ট্যাম্পারিং — ডেটা পরিবর্তন করা (যেমন লেনদেনের পরিমাণ পরিবর্তন), (৩) রিপুডিয়েশন — আপনি কিছু করেছেন তা অস্বীকার করা (অডিট ট্রেইল নেই), (৪) ইনফরমেশন ডিসক্লোজার — সংবেদনশীল ডেটা ফাঁস, (৫) ডিনায়াল অফ সার্ভিস — সিস্টেম ক্র্যাশ করা, (৬) এলিভেশন অফ প্রিভিলেজ — অ্যাডমিন অ্যাক্সেস পাওয়া। এই পরিভাষায় চিন্তা করা আপনাকে ঝুঁকি ঘটার আগেই শনাক্ত করতে সাহায্য করে।\n\nবাংলাদেশের উদাহরণ: বাংলাদেশের একটি সরকারি ওয়েবসাইট অ্যাক্সেসের চেষ্টা লগ করতে ব্যর্থ হয় (রিপুডিয়েশন)। যখন কেউ ভুয়া তথ্য পোস্ট করে, প্রশাসকরা প্রমাণ করতে পারেননি কে এটি করেছে, যার ফলে কাউকে জবাবদিহি করা অসম্ভব হয়ে পড়ে।\n\nসংক্ষিপ্ত শিক্ষা: পেশাদার হতে হবে না, পেশাদারের মতো চিন্তা করুন। নিজেকে প্রশ্ন করুন: 'কে আমার পরিচয় জাল করতে পারে? আমার ডেটা কোথায় উন্মুক্ত?' — এটাই দৈনন্দিন জীবনের জন্য থ্রেট মডেলিং।",
            7,
        ),
        (
            "Network Security Basics",
            "নেটওয়ার্ক নিরাপত্তার মৌলিক বিষয়",
            "Hook: 'Firewalls and VPNs — I hear about them, but what are they actually doing?'\n\nCore Explanation: (1) Firewall — a barrier between your network and the internet. It blocks unauthorized access by inspecting incoming and outgoing traffic. Think of it as a security guard checking IDs at the door. (2) VPN (Virtual Private Network) — creates an encrypted tunnel for your internet traffic. It hides your browsing activity from your ISP and anyone on the same network (like public Wi-Fi).\n\nBangladesh Example: During nationwide protests in 2024, many activists used VPNs to secure their communications and bypass censorship. Without it, their browsing data was exposed to ISPs and could be monitored.\n\nTakeaway: Always use a VPN on public Wi-Fi. Ensure your home router firewall is enabled. These two tools together make you a harder target.",
            "Hook: 'ফায়ারওয়াল এবং VPN — আমি এদের সম্পর্কে শুনি, কিন্তু এরা আসলে কী করে?'\n\nমূল ব্যাখ্যা: (১) ফায়ারওয়াল — আপনার নেটওয়ার্ক এবং ইন্টারনেটের মধ্যে একটি বাধা। এটি আগত এবং বহির্গামী ট্রাফিক পরিদর্শন করে অননুমোদিত অ্যাক্সেস ব্লক করে। এটাকে দরজায় আইডি চেক করা নিরাপত্তা প্রহরীর মতো মনে করুন। (২) VPN (ভার্চুয়াল প্রাইভেট নেটওয়ার্ক) — আপনার ইন্টারনেট ট্রাফিকের জন্য একটি এনক্রিপ্টেড টানেল তৈরি করে। এটি আপনার ব্রাউজিং কার্যকলাপ আপনার ISP এবং একই নেটওয়ার্কে থাকা যে কেউ (যেমন পাবলিক ওয়াই-ফাই) থেকে লুকিয়ে রাখে।\n\nবাংলাদেশের উদাহরণ: ২০২৪ সালের দেশব্যাপী প্রতিবাদের সময় অনেক কর্মী তাদের যোগাযোগ সুরক্ষিত করতে এবং সেন্সরশিপ এড়াতে VPN ব্যবহার করেছিল। এটি ছাড়া, তাদের ব্রাউজিং ডেটা ISP-এর কাছে উন্মুক্ত ছিল এবং পর্যবেক্ষণ করা যেত।\n\nসংক্ষিপ্ত শিক্ষা: পাবলিক ওয়াই-ফাইতে সবসময় VPN ব্যবহার করুন। নিশ্চিত করুন আপনার হোম রাউটারের ফায়ারওয়াল সক্রিয় আছে। এই দুটি টুল একসাথে আপনাকে একটি শক্ত টার্গেট করে তোলে।",
            7,
        ),
        (
            "Careers in Cybersecurity in Bangladesh",
            "বাংলাদেশে সাইবার নিরাপত্তায় কর্মজীবন",
            "Hook: 'I've learned all this — but can I actually build a career out of it?' — yes, and Bangladesh needs you.\n\nCore Explanation: The cybersecurity industry is growing rapidly in Bangladesh. Career paths include: (1) Security Analyst — monitoring systems for breaches, (2) Penetration Tester — trying to hack systems to find weaknesses, (3) Security Engineer — building secure systems, (4) GRC (Governance, Risk, Compliance) — ensuring policies are followed. The government, banks, and tech companies are actively hiring. Certifications like CompTIA Security+, CEH, and CISSP are valuable.\n\nBangladesh Example: In 2025, Bangladeshi universities started offering dedicated cybersecurity degrees. Students graduating from these programs are being hired by banks like bKash and Nagad, as well as government agencies, with starting salaries that rival software engineers.\n\nTakeaway: You don't need to be a coding genius to get started. Curiosity, attention to detail, and a willingness to learn are more important. The demand is high — start learning, build projects (like this one!), and apply.",
            "Hook: 'আমি এই সব শিখেছি — কিন্তু আমি কি আসলেই এতে ক্যারিয়ার গড়তে পারি?' — হ্যাঁ, এবং বাংলাদেশের আপনার প্রয়োজন।\n\nমূল ব্যাখ্যা: বাংলাদেশে সাইবার নিরাপত্তা শিল্প দ্রুত বাড়ছে। ক্যারিয়ারের পথগুলির মধ্যে রয়েছে: (১) সিকিউরিটি অ্যানালিস্ট — লঙ্ঘনের জন্য সিস্টেম পর্যবেক্ষণ, (২) পেনিট্রেশন টেস্টার — দুর্বলতা খুঁজতে সিস্টেম হ্যাক করার চেষ্টা, (৩) সিকিউরিটি ইঞ্জিনিয়ার — নিরাপদ সিস্টেম তৈরি, (৪) GRC (গভর্নেন্স, রিস্ক, কমপ্লায়েন্স) — নীতি অনুসরণ নিশ্চিত করা। সরকার, ব্যাংক ও প্রযুক্তি কোম্পানি সক্রিয়ভাবে নিয়োগ দিচ্ছে। CompTIA Security+, CEH, এবং CISSP-এর মতো সার্টিফিকেশন মূল্যবান।\n\nবাংলাদেশের উদাহরণ: ২০২৫ সালে বাংলাদেশি বিশ্ববিদ্যালয়গুলি সাইবার নিরাপত্তায় ডেডিকেটেড ডিগ্রি চালু করতে শুরু করেছে। এই প্রোগ্রামগুলি থেকে স্নাতক হওয়া শিক্ষার্থীদের বিকাশ ও নগদের মতো ব্যাংক এবং সরকারি সংস্থাগুলি নিয়োগ করছে, যেখানে শুরু করার বেতন সফটওয়্যার ইঞ্জিনিয়ারদের সমান।\n\nসংক্ষিপ্ত শিক্ষা: শুরু করতে কোডিং প্রতিভা হতে হবে না। কৌতূহল, বিস্তারিত মনোযোগ, এবং শিখতে ইচ্ছুকতা বেশি গুরুত্বপূর্ণ। চাহিদা বেশি — শেখা শুরু করুন, প্রজেক্ট তৈরি করুন (এটির মতো!) এবং আবেদন করুন।",
            7,
        ),
    ]

    # -------------------------
    # 3. All quizzes (23 blocks, matching lessons above)
    # -------------------------
    quizzes_data = [
        # Tier 0 (5)
        [
            ("Why do most cybercriminals target ordinary people instead of only \"important\" targets?",
             "কেন বেশিরভাগ সাইবার অপরাধী শুধু \"গুরুত্বপূর্ণ\" মানুষের বদলে সাধারণ মানুষকে টার্গেট করে?",
             ["Ordinary people have more money", "Attacks are often automated and sent to huge numbers of people at once", "Important people are always better protected", "It's illegal to target important people"],
             ["সাধারণ মানুষের কাছে বেশি টাকা থাকে", "আক্রমণগুলো প্রায়ই স্বয়ংক্রিয় এবং একসাথে বিশাল সংখ্যক মানুষকে পাঠানো হয়", "গুরুত্বপূর্ণ মানুষ সবসময় ভালোভাবে সুরক্ষিত", "গুরুত্বপূর্ণ মানুষকে টার্গেট করা বেআইনি"],
             1),
            ("What made most of Bangladesh's recent mobile financial service scams effective?",
             "বাংলাদেশের সাম্প্রতিক মোবাইল ফাইন্যান্সিয়াল সার্ভিস স্ক্যামগুলো কেন এত কার্যকর হয়েছিল?",
             ["Advanced hacking tools", "Simple SMS and phone call tricks", "Physical theft of phones", "Government data leaks"],
             ["উন্নত হ্যাকিং টুল", "সাধারণ এসএমএস এবং ফোন কল কৌশল", "ফোন চুরি", "সরকারি ডেটা লিক"],
             1),
            ("What is the safest assumption to make about your own risk online?",
             "নিজের ঝুঁকি সম্পর্কে সবচেয়ে নিরাপদ ধারণা কোনটি?",
             ["I'm too unimportant to be targeted", "Only my bank needs to worry about my security", "Anyone reachable by phone or internet is a potential target", "Only businesses need cybersecurity"],
             ["আমি টার্গেট হওয়ার মতো যথেষ্ট গুরুত্বপূর্ণ না", "শুধু আমার ব্যাংকের নিরাপত্তা নিয়ে ভাবা উচিত", "ফোন বা ইন্টারনেটে পৌঁছানো যায় এমন যে কেউ সম্ভাব্য টার্গেট", "শুধু ব্যবসা প্রতিষ্ঠানের সাইবার নিরাপত্তা দরকার"],
             2),
            ("Which comparison best describes why everyone needs basic cybersecurity habits?",
             "কেন সবার জন্য মৌলিক সাইবার নিরাপত্তা অভ্যাস দরকার, এটা বোঝাতে কোন তুলনাটি সবচেয়ে ভালো?",
             ["It's optional, like a hobby", "It's basic, like locking your front door", "It's only needed if you're wealthy", "It's only relevant to computer scientists"],
             ["এটা ঐচ্ছিক, শখের মতো", "এটা মৌলিক, দরজায় তালা দেওয়ার মতো", "এটা শুধু ধনী মানুষের জন্য দরকার", "এটা শুধু কম্পিউটার বিজ্ঞানীদের জন্য প্রাসঙ্গিক"],
             1),
        ],
        [
            ("If someone tricks you into voluntarily sharing your bKash PIN over a phone call, this is best described as a:",
             "কেউ যদি ফোন কলে আপনাকে প্রতারণা করে স্বেচ্ছায় বিকাশ পিন শেয়ার করায়, এটাকে সবচেয়ে ভালোভাবে বলা যায়:",
             ["Hack", "Scam", "Virus", "Firewall breach"],
             ["হ্যাক", "স্ক্যাম", "ভাইরাস", "ফায়ারওয়াল ভঙ্গ"],
             1),
            ("What is the defining feature of a \"hack\"?",
             "\"হ্যাক\"-এর মূল বৈশিষ্ট্য কী?",
             ["Tricking someone through conversation", "Gaining unauthorized access to an account or system", "Installing a legitimate app", "Sending spam emails"],
             ["কথোপকথনের মাধ্যমে প্রতারণা করা", "কোনো অ্যাকাউন্ট বা সিস্টেমে অনুমতি ছাড়া প্রবেশ করা", "বৈধ অ্যাপ ইনস্টল করা", "স্প্যাম ইমেইল পাঠানো"],
             1),
            ("Malicious software that runs on your device without full awareness is called:",
             "আপনার ডিভাইসে সম্পূর্ণ সচেতনতা ছাড়াই চলা ক্ষতিকর সফটওয়্যারকে বলা হয়:",
             ["A scam", "A hack", "Malware/virus", "A firewall"],
             ["স্ক্যাম", "হ্যাক", "ম্যালওয়্যার/ভাইরাস", "ফায়ারওয়াল"],
             2),
            ("Why does it matter to distinguish between a scam, a hack, and a virus?",
             "স্ক্যাম, হ্যাক, এবং ভাইরাসের মধ্যে পার্থক্য বোঝা কেন গুরুত্বপূর্ণ?",
             ["It doesn't matter, they're all the same", "Each requires a different response and prevention method", "Only hacks are dangerous", "Only viruses can be reported to authorities"],
             ["গুরুত্বপূর্ণ না, সবই একই", "প্রতিটির জন্য আলাদা প্রতিক্রিয়া এবং প্রতিরোধ পদ্ধতি দরকার", "শুধু হ্যাক বিপজ্জনক", "শুধু ভাইরাস কর্তৃপক্ষের কাছে রিপোর্ট করা যায়"],
             1),
        ],
        [
            ("What is a \"digital footprint\"?",
             "\"ডিজিটাল ফুটপ্রিন্ট\" কী?",
             ["Only your bank account information", "The trail of information you leave behind online", "Your phone's physical location only", "A type of computer virus"],
             ["শুধু আপনার ব্যাংক অ্যাকাউন্টের তথ্য", "অনলাইনে আপনি যে তথ্যের চিহ্ন রেখে যান", "শুধু আপনার ফোনের ভৌত অবস্থান", "এক ধরনের কম্পিউটার ভাইরাস"],
             1),
            ("What's the difference between \"active\" and \"passive\" digital footprint?",
             "\"সক্রিয়\" এবং \"নিষ্ক্রিয়\" ডিজিটাল ফুটপ্রিন্টের মধ্যে পার্থক্য কী?",
             ["There is no difference", "Active is what you deliberately post; passive is data collected without direct action", "Active is only photos; passive is only text", "Passive footprint doesn't exist in real life"],
             ["কোনো পার্থক্য নেই", "সক্রিয় হলো আপনি ইচ্ছাকৃতভাবে যা পোস্ট করেন; নিষ্ক্রিয় হলো সরাসরি কাজ ছাড়াই সংগ্রহ করা ডেটা", "সক্রিয় শুধু ছবি; নিষ্ক্রিয় শুধু লেখা", "বাস্তব জীবনে নিষ্ক্রিয় ফুটপ্রিন্টের অস্তিত্ব নেই"],
             1),
            ("What does \"OSINT\" refer to in a cybersecurity context?",
             "সাইবার নিরাপত্তার প্রেক্ষাপটে \"OSINT\" বলতে কী বোঝায়?",
             ["A type of virus", "Gathering information from publicly available sources", "A government surveillance law", "A type of encryption"],
             ["এক ধরনের ভাইরাস", "পাবলিকলি উপলব্ধ উৎস থেকে তথ্য সংগ্রহ করা", "একটা সরকারি নজরদারি আইন", "এক ধরনের এনক্রিপশন"],
             1),
            ("Why might a scammer research your public posts before targeting you?",
             "একজন স্ক্যামার কেন আপনাকে টার্গেট করার আগে আপনার পাবলিক পোস্ট গবেষণা করতে পারে?",
             ["It's required by law", "To make a scam feel personal and more convincing", "To verify your identity for a bank", "It has no real benefit to scammers"],
             ["এটা আইন অনুযায়ী বাধ্যতামূলক", "স্ক্যামটিকে ব্যক্তিগত এবং আরও বিশ্বাসযোগ্য মনে করাতে", "ব্যাংকের জন্য আপনার পরিচয় যাচাই করতে", "স্ক্যামারদের জন্য এর কোনো বাস্তব সুবিধা নেই"],
             1),
        ],
        [
            ("Which of these is a genuine red flag for a fake website?",
             "একটা ভুয়া ওয়েবসাইটের জন্য নিচের কোনটি প্রকৃত লাল পতাকা?",
             ["The site loads slowly", "The domain spelling is slightly different from the real one", "The site has a logo", "The site asks for your name"],
             ["সাইট ধীরে লোড হয়", "ডোমেইনের বানান আসল থেকে সামান্য ভিন্ন", "সাইটে একটা লোগো আছে", "সাইট আপনার নাম জিজ্ঞাসা করে"],
             1),
            ("Does the padlock icon (https://) alone guarantee a website is legitimate?",
             "প্যাডলক আইকন (https://) একা কি একটা ওয়েবসাইট বৈধ তার নিশ্চয়তা দেয়?",
             ["No — it only means the connection is encrypted, not that the site is trustworthy", "Yes, it's a 100% guarantee", "It means the site is government-verified", "It has nothing to do with security"],
             ["না — এটা শুধু বোঝায় সংযোগ এনক্রিপ্টেড, সাইট বিশ্বাসযোগ্য তা না", "হ্যাঁ, এটা ১০০% নিশ্চয়তা", "এটা বোঝায় সাইট সরকার-অনুমোদিত", "নিরাপত্তার সাথে এর কোনো সম্পর্ক নেই"],
             0),
            ("A message saying \"Your account will be deleted in 1 hour, verify now!\" is an example of:",
             "\"আপনার অ্যাকাউন্ট ১ ঘণ্টার মধ্যে মুছে ফেলা হবে, এখনই ভেরিফাই করুন!\" — এটা কিসের উদাহরণ?",
             ["Normal customer service", "An urgency-based pressure tactic commonly used in scams", "A required legal notice", "A software update"],
             ["স্বাভাবিক গ্রাহক সেবা", "স্ক্যামে সাধারণত ব্যবহৃত তাড়াহুড়ো-ভিত্তিক চাপ প্রয়োগের কৌশল", "একটা প্রয়োজনীয় আইনি নোটিশ", "একটা সফটওয়্যার আপডেট"],
             1),
            ("What's the safest way to visit your bank or mobile banking site?",
             "আপনার ব্যাংক বা মোবাইল ব্যাংকিং সাইটে যাওয়ার সবচেয়ে নিরাপদ উপায় কী?",
             ["Click the link sent to you by SMS", "Search for it and click the first result", "Type the official address yourself or use the official app", "Trust any site with a padlock icon"],
             ["এসএমএসে পাঠানো লিংকে ক্লিক করা", "সার্চ করে প্রথম ফলাফলে ক্লিক করা", "নিজে অফিসিয়াল ঠিকানা টাইপ করা অথবা অফিসিয়াল অ্যাপ ব্যবহার করা", "প্যাডলক আইকনসহ যেকোনো সাইট বিশ্বাস করা"],
             2),
        ],
        [
            ("Why are software updates important for security?",
             "নিরাপত্তার জন্য সফটওয়্যার আপডেট কেন গুরুত্বপূর্ণ?",
             ["They make your phone look newer", "They patch known security holes that attackers actively exploit", "They are only for adding new emojis", "They have no security purpose"],
             ["এটা ফোনকে নতুন দেখায়", "এগুলো পরিচিত নিরাপত্তা ত্রুটি ঠিক করে যা আক্রমণকারীরা সক্রিয়ভাবে ব্যবহার করে", "এটা শুধু নতুন ইমোজি যোগ করার জন্য", "এর কোনো নিরাপত্তা উদ্দেশ্য নেই"],
             1),
            ("What is the main risk of not having a screen lock on your phone?",
             "ফোনে স্ক্রিন লক না থাকার প্রধান ঝুঁকি কী?",
             ["The phone battery drains faster", "A lost or stolen phone gives instant access to your apps and data", "The phone runs slower", "There is no real risk"],
             ["ফোনের ব্যাটারি দ্রুত শেষ হয়", "হারানো বা চুরি যাওয়া ফোন সাথে সাথে আপনার অ্যাপ এবং ডেটাতে প্রবেশাধিকার দেয়", "ফোন ধীরে চলে", "কোনো বাস্তব ঝুঁকি নেই"],
             1),
            ("Why should you periodically review app permissions?",
             "মাঝে মাঝে অ্যাপ পারমিশন পর্যালোচনা করা কেন উচিত?",
             ["It's required by law in Bangladesh", "Many apps request more access than they actually need", "It makes apps run faster", "It's only relevant for business apps"],
             ["বাংলাদেশে এটা আইন অনুযায়ী বাধ্যতামূলক", "অনেক অ্যাপ তাদের আসলে যা দরকার তার চেয়ে বেশি অ্যাক্সেস চায়", "এটা অ্যাপকে দ্রুত চালায়", "এটা শুধু ব্যবসায়িক অ্যাপের জন্য প্রাসঙ্গিক"],
             1),
            ("What's a realistic everyday risk mentioned in this lesson?",
             "এই পাঠে উল্লেখিত একটা বাস্তবসম্মত দৈনন্দিন ঝুঁকি কী?",
             ["Using a strong password manager", "Lending your unlocked phone to someone briefly", "Installing official app updates", "Using a VPN on public Wi-Fi"],
             ["একটা শক্তিশালী পাসওয়ার্ড ম্যানেজার ব্যবহার করা", "সংক্ষিপ্ত সময়ের জন্য আনলক করা ফোন কাউকে ধার দেওয়া", "অফিসিয়াল অ্যাপ আপডেট ইনস্টল করা", "পাবলিক ওয়াই-ফাইতে ভিপিএন ব্যবহার করা"],
             1),
        ],
        # Tier 1 (6)
        [
            ("Why is using the same password for multiple accounts risky?",
             "একাধিক অ্যাকাউন্টের জন্য একই পাসওয়ার্ড ব্যবহার করা কেন ঝুঁকিপূর্ণ?",
             ["It's easier to remember", "If one site gets breached, attackers try that password everywhere", "It's not risky at all", "Passwords are always safe"],
             ["মনে রাখা সহজ হয়", "যদি একটি সাইট হ্যাক হয়, আক্রমণকারীরা সেই পাসওয়ার্ড সব জায়গায় চেষ্টা করে", "এতে কোনো ঝুঁকি নেই", "পাসওয়ার্ড সবসময় নিরাপদ"],
             1),
            ("What makes a password stronger?",
             "পাসওয়ার্ডকে কী শক্তিশালী করে?",
             ["Using common words like 'password'", "Length and uniqueness", "Adding a single number at the end", "Using your birthday"],
             ["সাধারণ শব্দ যেমন 'password' ব্যবহার", "দৈর্ঘ্য ও স্বাতন্ত্র্য", "শেষে একটি নম্বর যোগ করা", "আপনার জন্মদিন ব্যবহার"],
             1),
            ("What is the recommended way to manage many different passwords?",
             "অনেক ভিন্ন পাসওয়ার্ড পরিচালনার প্রস্তাবিত উপায় কী?",
             ["Write them all down in a notebook", "Use the same password for everything", "Use a password manager", "Ask a friend to remember them"],
             ["সবগুলো একটি খাতায় লিখে রাখা", "সবকিছুর জন্য একই পাসওয়ার্ড ব্যবহার", "পাসওয়ার্ড ম্যানেজার ব্যবহার", "বন্ধুকে মনে রাখতে বলা"],
             2),
            ("What happened to Bangladeshi users who reused passwords after the 2024 data leak?",
             "২০২৪ সালের ডেটা লিকের পর যারা পাসওয়ার্ড পুনরায় ব্যবহার করেছিল তাদের কী হয়েছিল?",
             ["Nothing happened", "They lost access to multiple accounts within hours", "They received a warning", "Their accounts were automatically secured"],
             ["কিছু হয়নি", "ঘণ্টার মধ্যে তারা একাধিক অ্যাকাউন্ট অ্যাক্সেস হারায়", "তারা একটি সতর্কতা পায়", "তাদের অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে সুরক্ষিত হয়"],
             1),
        ],
        [
            ("What is Two-Factor Authentication (2FA)?",
             "দ্বি-স্তরীয় প্রমাণীকরণ (২FA) কী?",
             ["A second password", "A second layer of security beyond your password", "A security question", "A fingerprint scan only"],
             ["দ্বিতীয় পাসওয়ার্ড", "পাসওয়ার্ডের বাইরে নিরাপত্তার দ্বিতীয় স্তর", "একটি নিরাপত্তা প্রশ্ন", "শুধু আঙুলের ছাপ"],
             1),
            ("Which form of 2FA is generally considered more secure than SMS?",
             "SMS-এর চেয়ে কোন ধরনের ২FA সাধারণত বেশি নিরাপদ বলে বিবেচিত?",
             ["Email code", "Authenticator app (Google Authenticator, etc.)", "Phone call", "Security question"],
             ["ইমেইল কোড", "অথেনটিকেটর অ্যাপ (Google Authenticator ইত্যাদি)", "ফোন কল", "নিরাপত্তা প্রশ্ন"],
             1),
            ("Even if an attacker steals your password, what prevents them from logging in if you have 2FA enabled?",
             "আপনার পাসওয়ার্ড চুরি গেলেও ২FA চালু থাকলে আক্রমণকারীকে লগইন করতে কী বাধা দেয়?",
             ["Nothing", "They still need the second factor (e.g., your phone)", "They need a physical key", "2FA doesn't help against password theft"],
             ["কিছুই না", "তাদের দ্বিতীয় ফ্যাক্টর প্রয়োজন (যেমন আপনার ফোন)", "তাদের একটি ফিজিক্যাল কী প্রয়োজন", "পাসওয়ার্ড চুরির বিরুদ্ধে ২FA সাহায্য করে না"],
             1),
            ("How did 2FA protect some bKash users during the 2023 phishing campaign?",
             "২০২৩ সালের ফিশিং অভিযানের সময় ২FA কীভাবে কিছু বিকাশ ব্যবহারকারীকে রক্ষা করেছিল?",
             ["It did nothing", "It prevented attackers from logging in even with stolen passwords", "It notified the police", "It changed their passwords automatically"],
             ["এটা কিছুই করেনি", "এটা পাসওয়ার্ড চুরি হলেও আক্রমণকারীদের লগইন করতে বাধা দেয়", "এটা পুলিশকে জানায়", "এটা স্বয়ংক্রিয়ভাবে তাদের পাসওয়ার্ড পরিবর্তন করে"],
             1),
        ],
        [
            ("What is a classic sign of a phishing attempt?",
             "ফিশিং চেষ্টার একটি ক্লাসিক লক্ষণ কী?",
             ["A polite request", "Urgent language and a request for personal information", "A well-designed email", "A request from a friend"],
             ["ভদ্র অনুরোধ", "জরুরি ভাষা ও ব্যক্তিগত তথ্যের অনুরোধ", "সুন্দর ডিজাইন করা ইমেইল", "বন্ধুর কাছ থেকে অনুরোধ"],
             1),
            ("What should you do if you receive a suspicious message claiming to be from your bank?",
             "আপনার ব্যাংকের দাবিতে সন্দেহজনক মেসেজ পেলে আপনার কী করা উচিত?",
             ["Click the link to verify quickly", "Ignore it completely", "Contact the bank directly using official channels", "Reply and ask for more details"],
             ["দ্রুত যাচাই করতে লিংকে ক্লিক করুন", "এটি সম্পূর্ণ উপেক্ষা করুন", "অফিসিয়াল চ্যানেলে ব্যাংকের সাথে সরাসরি যোগাযোগ করুন", "উত্তর দিয়ে আরও বিস্তারিত জানতে চান"],
             2),
            ("Which of these is a common phishing tactic in Bangladesh?",
             "বাংলাদেশে কোনটি একটি সাধারণ ফিশিং কৌশল?",
             ["Fake bKash login pages sent via SMS", "Official government emails", "Bank calls asking for your account balance", "Friends on social media"],
             ["এসএমএসের মাধ্যমে ভুয়া বিকাশ লগইন পেজ", "সরকারি ইমেইল", "ব্যাংকের কল যা আপনার অ্যাকাউন্ট ব্যালেন্স জিজ্ঞাসা করে", "সোশ্যাল মিডিয়ায় বন্ধুরা"],
             0),
            ("What does 'verify independently' mean in the context of phishing?",
             "ফিশিংয়ের প্রসঙ্গে 'স্বাধীনভাবে যাচাই করুন' বলতে কী বোঝায়?",
             ["Trust the message you received", "Check the information through official channels without using the link in the suspicious message", "Forward the message to your friends", "Reply to the message asking for confirmation"],
             ["আপনি যে মেসেজ পেয়েছেন তা বিশ্বাস করুন", "সন্দেহজনক মেসেজের লিংক ব্যবহার না করে অফিসিয়াল চ্যানেলে তথ্য যাচাই করুন", "মেসেজটি বন্ধুদের ফরওয়ার্ড করুন", "নিশ্চিতকরণ চেয়ে মেসেজের উত্তর দিন"],
             1),
        ],
        [
            ("Why is oversharing on social media dangerous?",
             "সোশ্যাল মিডিয়ায় বেশি শেয়ার করা কেন বিপজ্জনক?",
             ["It's not dangerous at all", "It helps attackers build a detailed profile about you", "It makes your profile look more interesting", "It's only dangerous for celebrities"],
             ["এটি মোটেও বিপজ্জনক নয়", "এটা আক্রমণকারীদের আপনার সম্পর্কে বিস্তারিত প্রোফাইল তৈরি করতে সাহায্য করে", "এটা আপনার প্রোফাইলকে আরও আকর্ষণীয় করে তোলে", "এটা শুধু সেলিব্রিটিদের জন্য বিপজ্জনক"],
             1),
            ("What is a recommended privacy setting for sensitive social media posts?",
             "সংবেদনশীল সোশ্যাল মিডিয়া পোস্টের জন্য একটি প্রস্তাবিত গোপনীয়তা সেটিং কী?",
             ["Public", "Friends only", "Share with everyone", "No privacy settings are needed"],
             ["সবার জন্য", "শুধু বন্ধু", "সবার সাথে শেয়ার", "গোপনীয়তা সেটিংসের প্রয়োজন নেই"],
             1),
            ("What do attackers often do with the information you share on social media?",
             "আপনি সোশ্যাল মিডিয়ায় যে তথ্য শেয়ার করেন আক্রমণকারীরা প্রায়ই তা দিয়ে কী করে?",
             ["They ignore it", "They use it to create personalized scams", "They use it to improve your profile", "They sell it to advertisers"],
             ["তারা তা উপেক্ষা করে", "তারা তা ব্যক্তিগত স্ক্যাম তৈরি করতে ব্যবহার করে", "তারা তা আপনার প্রোফাইল উন্নত করতে ব্যবহার করে", "তারা তা বিজ্ঞাপনদাতাদের কাছে বিক্রি করে"],
             1),
            ("What was the method used by fraudsters in the 2024 Bangladesh social media scam?",
             "২০২৪ সালের বাংলাদেশের সোশ্যাল মিডিয়া স্ক্যামে জালিয়াতরা কী পদ্ধতি ব্যবহার করেছিল?",
             ["Hacking Facebook accounts", "Creating fake profiles to befriend people and then asking for money", "Stealing passwords via phishing emails", "Sending malware through links"],
             ["ফেসবুক অ্যাকাউন্ট হ্যাক করা", "ভুয়া প্রোফাইল তৈরি করে মানুষকে বন্ধু বানিয়ে তারপর টাকা চাওয়া", "ফিশিং ইমেইলের মাধ্যমে পাসওয়ার্ড চুরি করা", "লিংকের মাধ্যমে ম্যালওয়্যার পাঠানো"],
             1),
        ],
        [
            ("How do QR code scams typically work?",
             "কিউআর কোড স্ক্যাম সাধারণত কীভাবে কাজ করে?",
             ["They hack the QR code reader", "They replace legitimate QR codes with fake ones that redirect payments to scammers", "They send QR codes via email", "They use QR codes to install viruses"],
             ["তারা কিউআর কোড রিডার হ্যাক করে", "তারা আসল কিউআর কোডের জায়গায় ভুয়া কোড লাগায় যা পেমেন্ট স্ক্যামারের কাছে পুনর্নির্দেশ করে", "তারা ইমেইলের মাধ্যমে কিউআর কোড পাঠায়", "তারা কিউআর কোড দিয়ে ভাইরাস ইনস্টল করে"],
             1),
            ("What should you NEVER share with anyone regarding mobile payments?",
             "মোবাইল পেমেন্টের বিষয়ে আপনি কখনো কারোর সাথে কী শেয়ার করবেন না?",
             ["Your phone number", "Your PIN and OTP", "Your name", "Your account balance"],
             ["আপনার ফোন নম্বর", "আপনার পিন এবং ওটিপি", "আপনার নাম", "আপনার অ্যাকাউন্ট ব্যালেন্স"],
             1),
            ("What happened to shop owners in Bangladesh who had fake QR stickers placed over their original ones?",
             "বাংলাদেশে যেসব দোকানির আসল কিউআর কোডের ওপর ভুয়া স্টিকার লাগানো হয়েছিল তাদের কী হয়েছিল?",
             ["They got more customers", "They lost money because payments went to scammers' accounts", "They received warnings from the bank", "They caught the scammers"],
             ["তারা বেশি ক্রেতা পায়", "তারা টাকা হারায় কারণ পেমেন্ট স্ক্যামারদের অ্যাকাউন্টে চলে যেত", "তারা ব্যাংক থেকে সতর্কতা পায়", "তারা স্ক্যামারদের ধরে ফেলে"],
             1),
            ("How can you verify the destination of a QR code before scanning?",
             "স্ক্যান করার আগে কিউআর কোডের গন্তব্য কীভাবে যাচাই করবেন?",
             ["You can't verify it", "Check the payer/payee details in the app before confirming the transaction", "Ask the shopkeeper to show their phone", "Scan it quickly and hope it's correct"],
             ["আপনি যাচাই করতে পারেন না", "লেনদেন নিশ্চিত করার আগে অ্যাপে প্রেরক/প্রাপক বিবরণ যাচাই করুন", "দোকানিকে তাদের ফোন দেখাতে বলুন", "দ্রুত স্ক্যান করে আশা করুন সঠিক"],
             1),
        ],
        [
            ("Why is public Wi-Fi often risky?",
             "পাবলিক ওয়াই-ফাই কেন প্রায়ই ঝুঁকিপূর্ণ?",
             ["It's always secure", "Because it is often unencrypted, allowing others on the same network to intercept your data", "Because it's slow", "Because it costs money"],
             ["এটা সবসময় নিরাপদ", "কারণ এটি প্রায়ই এনক্রিপ্টেড হয় না, যার ফলে একই নেটওয়ার্কে থাকা অন্যরা আপনার ডেটা আটকাতে পারে", "কারণ এটি ধীর", "কারণ এতে টাকা খরচ হয়"],
             1),
            ("What is a common technique attackers use with public Wi-Fi?",
             "পাবলিক ওয়াই-ফাইতে আক্রমণকারীরা সাধারণত কী কৌশল ব্যবহার করে?",
             ["They improve the Wi-Fi signal", "They set up fake Wi-Fi hotspots with legitimate-sounding names", "They offer free coffee", "They increase internet speed"],
             ["তারা ওয়াই-ফাই সিগন্যাল উন্নত করে", "তারা বৈধ মনে হয় এমন নামে ভুয়া ওয়াই-ফাই হটস্পট স্থাপন করে", "তারা ফ্রি কফি দেয়", "তারা ইন্টারনেটের গতি বাড়ায়"],
             1),
            ("What should you use to protect your data on public Wi-Fi?",
             "পাবলিক ওয়াই-ফাইতে আপনার ডেটা সুরক্ষিত করতে কী ব্যবহার করবেন?",
             ["A strong password", "A VPN", "A firewall", "Antivirus software"],
             ["শক্তিশালী পাসওয়ার্ড", "ভিপিএন", "ফায়ারওয়াল", "অ্যান্টিভাইরাস সফটওয়্যার"],
             1),
            ("What happened at the Dhaka café with the fake Wi-Fi hotspot?",
             "ঢাকার ক্যাফেতে ভুয়া ওয়াই-ফাই হটস্পট নিয়ে কী ঘটেছিল?",
             ["Nobody connected", "Customers connected and had their credentials captured", "The café was closed", "The police arrested the attackers immediately"],
             ["কেউ সংযুক্ত হয়নি", "গ্রাহকরা সংযুক্ত হয় এবং তাদের ক্রেডেনশিয়াল আটক হয়", "ক্যাফে বন্ধ হয়ে যায়", "পুলিশ অবিলম্বে আক্রমণকারীদের গ্রেপ্তার করে"],
             1),
        ],
        # Tier 2 (6)
        [
            ("What is the first step in a typical scam SMS?",
             "একটি সাধারণ স্ক্যাম এসএমএসের প্রথম ধাপ কী?",
             ["A polite greeting", "A hook designed to trigger fear or greed", "A request for your name", "A link to a government website"],
             ["ভদ্র অভিবাদন", "ভয় বা লোভ সক্রিয় করার জন্য ডিজাইন করা একটি হুক", "আপনার নামের অনুরোধ", "সরকারি ওয়েবসাইটের লিংক"],
             1),
            ("What is the primary goal of the 'urgency' tactic in social engineering?",
             "সোশ্যাল ইঞ্জিনিয়ারিংয়ে 'জরুরি অবস্থা' কৌশলের প্রাথমিক লক্ষ্য কী?",
             ["To make you excited", "To bypass your rational thinking so you act without verification", "To ask for a favor", "To test your patience"],
             ["আপনাকে উত্তেজিত করা", "আপনার যুক্তিবোধকে বাইপাস করে যাচাই না করেই কাজ করানো", "অনুগ্রহ চাওয়া", "আপনার ধৈর্য পরীক্ষা করা"],
             1),
            ("Which of these is a red flag for a fake job post in Bangladesh?",
             "বাংলাদেশে ভুয়া চাকরির পোস্টের জন্য কোনটি একটি লাল পতাকা?",
             ["High salary with no experience needed and a request for an application fee", "A detailed company description", "A formal interview process", "A government registration number"],
             ["কোন অভিজ্ঞতা ছাড়াই উচ্চ বেতন ও আবেদন ফি চাওয়া", "বিশদ কোম্পানি বিবরণ", "একটি আনুষ্ঠানিক ইন্টারভিউ প্রক্রিয়া", "একটি সরকারি নিবন্ধন নম্বর"],
             0),
            ("What type of malware secretly monitors your activity?",
             "কোন ধরনের ম্যালওয়্যার গোপনে আপনার কার্যকলাপ পর্যবেক্ষণ করে?",
             ["Ransomware", "Spyware", "Virus", "Trojan"],
             ["র্যানসমওয়্যার", "স্পাইওয়্যার", "ভাইরাস", "ট্রোজান"],
             1),
        ],
        [
            ("What is the most common emotion exploited in social engineering attacks in Bangladesh?",
             "বাংলাদেশে সোশ্যাল ইঞ্জিনিয়ারিং আক্রমণে সবচেয়ে বেশি শোষিত আবেগ কোনটি?",
             ["Love", "Fear or Greed", "Curiosity", "Surprise"],
             ["ভালোবাসা", "ভয় বা লোভ", "কৌতূহল", "আশ্চর্য"],
             1),
            ("How do attackers typically initiate a SIM swap?",
             "আক্রমণকারীরা সাধারণত কীভাবে সিম সোয়াপ শুরু করে?",
             ["By stealing your phone", "By using your leaked personal info to convince the mobile operator", "By hacking the mobile network", "By sending a virus"],
             ["আপনার ফোন চুরি করে", "আপনার ফাঁস হওয়া ব্যক্তিগত তথ্য ব্যবহার করে মোবাইল অপারেটরকে বোঝানোর মাধ্যমে", "মোবাইল নেটওয়ার্ক হ্যাক করে", "ভাইরাস পাঠিয়ে"],
             1),
            ("What should you do if you suddenly lose mobile network signal?",
             "আপনি যদি হঠাৎ মোবাইল নেটওয়ার্ক সিগন্যাল হারান তবে আপনার কী করা উচিত?",
             ["Wait for it to come back", "Call your mobile operator immediately", "Restart your phone", "Do nothing"],
             ["ফিরে আসার জন্য অপেক্ষা করুন", "আপনার মোবাইল অপারেটরকে তাৎক্ষণিক কল করুন", "আপনার ফোন রিস্টার্ট করুন", "কিছু করবেন না"],
             1),
            ("Which government body handles cybercrime investigation in Bangladesh?",
             "বাংলাদেশে সাইবারক্রাইম তদন্ত কোন সরকারি সংস্থা পরিচালনা করে?",
             ["The Fire Service", "The Cyber Crime Investigation Division of Police", "The Army", "The Electricity Board"],
             ["ফায়ার সার্ভিস", "পুলিশের সাইবার ক্রাইম ইনভেস্টিগেশন বিভাগ", "সেনাবাহিনী", "বিদ্যুৎ বোর্ড"],
             1),
        ],
        [
            ("What is the final stage of the Cyber Kill Chain?",
             "সাইবার কিল চেইনের শেষ ধাপ কোনটি?",
             ["Reconnaissance", "Weaponization", "Actions on Objectives", "Installation"],
             ["রিকনেসান্স", "উইপোনাইজেশন", "অ্যাকশনস অন অবজেক্টিভস", "ইনস্টলেশন"],
             2),
            ("Why is a local bank's security team focusing on breaking a single link in the kill chain?",
             "একটি স্থানীয় ব্যাংকের নিরাপত্তা দল কেন কিল চেইনের একটি লিংক ভাঙার দিকে মনোযোগ দেয়?",
             ["It stops the entire attack", "It saves electricity", "It reduces the amount of malware", "It delays the attacker"],
             ["এটি পুরো আক্রমণ থামায়", "এটি বিদ্যুৎ বাঁচায়", "এটি ম্যালওয়্যারের পরিমাণ কমায়", "এটি আক্রমণকারীকে দেরি করায়"],
             0),
            ("What does 'Broken Access Control' mean in simple terms?",
             "'ভাঙা অ্যাক্সেস কন্ট্রোল' সহজ ভাষায় কী বোঝায়?",
             ["Users can access things they shouldn't see", "The site looks broken", "The password is weak", "The site takes too long to load"],
             ["ব্যবহারকারীরা এমন জিনিস অ্যাক্সেস করতে পারে যা তাদের দেখা উচিত নয়", "সাইটটি ভাঙা দেখায়", "পাসওয়ার্ড দুর্বল", "সাইট লোড হতে অনেক সময় নেয়"],
             0),
            ("What is the difference between Symmetric and Asymmetric encryption?",
             "সিমেট্রিক এবং অ্যাসিমেট্রিক এনক্রিপশনের মধ্যে পার্থক্য কী?",
             ["Symmetric uses one key; Asymmetric uses two keys", "Symmetric is better; Asymmetric is worse", "There is no difference", "Asymmetric uses one key; Symmetric uses two keys"],
             ["সিমেট্রিক একটি কী ব্যবহার করে; অ্যাসিমেট্রিক দুটি কী ব্যবহার করে", "সিমেট্রিক ভালো; অ্যাসিমেট্রিক খারাপ", "কোনো পার্থক্য নেই", "অ্যাসিমেট্রিক একটি কী ব্যবহার করে; সিমেট্রিক দুটি কী ব্যবহার করে"],
             0),
        ],
        [
            ("What is the primary law addressing cybercrime in Bangladesh?",
             "বাংলাদেশে সাইবারক্রাইম মোকাবেলার প্রাথমিক আইন কী?",
             ["Digital Security Act (2018)", "Penal Code 1860", "Information Technology Act", "Cyber Crime Act"],
             ["ডিজিটাল নিরাপত্তা আইন (২০১৮)", "দণ্ডবিধি ১৮৬০", "তথ্য প্রযুক্তি আইন", "সাইবার ক্রাইম আইন"],
             0),
            ("Which helpline number can you call to report cybercrime in Bangladesh?",
             "বাংলাদেশে সাইবারক্রাইম রিপোর্ট করতে কোন হেল্পলাইন নম্বরে কল করবেন?",
             ["100", "999", "102", "109"],
             ["১০০", "৯৯৯", "১০২", "১০৯"],
             1),
            ("What should you do immediately after falling victim to a scam?",
             "স্ক্যামের শিকার হওয়ার সাথে সাথে আপনার কী করা উচিত?",
             ["Ignore it", "Document everything and report via 999 or Cyber Crime portal", "Delete all messages", "Send money to the scammer"],
             ["উপেক্ষা করুন", "সবকিছু নথিভুক্ত করুন এবং ৯৯৯ বা সাইবার ক্রাইম পোর্টালে রিপোর্ট করুন", "সব মেসেজ ডিলিট করুন", "স্ক্যামারকে টাকা পাঠান"],
             1),
            ("What does the Digital Security Act primarily protect?",
             "ডিজিটাল নিরাপত্তা আইন প্রাথমিকভাবে কী সুরক্ষা দেয়?",
             ["Physical property", "Digital data and cyber activities", "Land ownership", "Intellectual property only"],
             ["ভৌত সম্পত্তি", "ডিজিটাল ডেটা ও সাইবার কার্যকলাপ", "জমির মালিকানা", "শুধু বৌদ্ধিক সম্পত্তি"],
             1),
        ],
        # Tier 3 (6)
        [
            ("What is the first stage of the Cyber Kill Chain?",
             "সাইবার কিল চেইনের প্রথম ধাপ কী?",
             ["Weaponization", "Reconnaissance", "Delivery", "Exploitation"],
             ["উইপোনাইজেশন", "রিকনেসান্স", "ডেলিভারি", "এক্সপ্লয়টেশন"],
             1),
            ("What happens during the 'Weaponization' stage?",
             "'উইপোনাইজেশন' ধাপে কী ঘটে?",
             ["The attacker delivers the payload", "The attacker creates a malicious payload", "The attacker installs malware", "The attacker steals data"],
             ["আক্রমণকারী পেলোড ডেলিভারি করে", "আক্রমণকারী ক্ষতিকর পেলোড তৈরি করে", "আক্রমণকারী ম্যালওয়্যার ইনস্টল করে", "আক্রমণকারী ডেটা চুরি করে"],
             1),
            ("At which stage can defenders stop the attack most easily?",
             "কোন ধাপে প্রতিরক্ষাকারীরা সবচেয়ে সহজে আক্রমণ থামাতে পারে?",
             ["Actions on Objectives", "Delivery", "Reconnaissance", "Command & Control"],
             ["অ্যাকশনস অন অবজেক্টিভস", "ডেলিভারি", "রিকনেসান্স", "কমান্ড ও কন্ট্রোল"],
             1),
            ("Why is breaking a single link in the kill chain effective?",
             "কিল চেইনের একটি লিংক ভাঙা কেন কার্যকর?",
             ["It makes the attack slower", "It stops the entire attack", "It confuses the attacker", "It reduces damage"],
             ["এটি আক্রমণকে ধীর করে", "এটি পুরো আক্রমণ থামায়", "এটি আক্রমণকারীকে বিভ্রান্ত করে", "এটি ক্ষতি কমায়"],
             1),
        ],
        [
            ("Which OWASP risk allows users to access things they shouldn't?",
             "কোন OWASP ঝুঁকি ব্যবহারকারীদের এমন জিনিস অ্যাক্সেস করতে দেয় যা তাদের দেখা উচিত নয়?",
             ["Injection", "Broken Access Control", "Cryptographic Failures", "XSS"],
             ["ইনজেকশন", "ভাঙা অ্যাক্সেস কন্ট্রোল", "ক্রিপ্টোগ্রাফিক ফেইলিউর", "XSS"],
             1),
            ("What is an example of 'Cryptographic Failure'?",
             "'ক্রিপ্টোগ্রাফিক ফেইলিউর'-এর উদাহরণ কী?",
             ["Using HTTPS", "Sending passwords in plain text", "Having a firewall", "Using 2FA"],
             ["HTTPS ব্যবহার করা", "পাসওয়ার্ড প্লেইন টেক্সটে পাঠানো", "ফায়ারওয়াল থাকা", "২FA ব্যবহার করা"],
             1),
            ("What is SQL Injection?",
             "SQL ইনজেকশন কী?",
             ["A type of virus", "Tricking the system into executing malicious SQL code", "A firewall bypass", "A password cracker"],
             ["এক ধরনের ভাইরাস", "সিস্টেমকে ক্ষতিকর SQL কোড এক্সিকিউট করতে বাধ্য করা", "ফায়ারওয়াল বাইপাস", "পাসওয়ার্ড ক্র্যাকার"],
             1),
            ("Why should you care about OWASP Top 10 as a non-developer?",
             "একজন নন-ডেভেলপার হিসেবে OWASP টপ ১০ কেন জানা উচিত?",
             ["It's only for developers", "Because these vulnerabilities affect your security when using websites", "It's not relevant", "It's a government regulation"],
             ["এটা শুধু ডেভেলপারদের জন্য", "কারণ এই দুর্বলতাগুলো ওয়েবসাইট ব্যবহার করার সময় আপনার নিরাপত্তাকে প্রভাবিত করে", "এটি প্রাসঙ্গিক নয়", "এটি একটি সরকারি নিয়ম"],
             1),
        ],
        [
            ("What is the main purpose of encryption?",
             "এনক্রিপশনের মূল উদ্দেশ্য কী?",
             ["To make data faster", "To scramble data so only intended recipients can read it", "To delete data", "To compress data"],
             ["ডেটা দ্রুত করা", "ডেটা স্ক্র্যাম্বল করা যাতে শুধু উদ্দিষ্ট প্রাপক তা পড়তে পারে", "ডেটা ডিলিট করা", "ডেটা কম্প্রেস করা"],
             1),
            ("What is the difference between Symmetric and Asymmetric encryption?",
             "সিমেট্রিক এবং অ্যাসিমেট্রিক এনক্রিপশনের মধ্যে পার্থক্য কী?",
             ["Symmetric uses one key; Asymmetric uses two keys", "Symmetric is faster; Asymmetric is slower", "Both are the same", "Asymmetric is more secure"],
             ["সিমেট্রিক একটি কী ব্যবহার করে; অ্যাসিমেট্রিক দুটি কী ব্যবহার করে", "সিমেট্রিক দ্রুত; অ্যাসিমেট্রিক ধীর", "দুটো একই", "অ্যাসিমেট্রিক বেশি নিরাপদ"],
             0),
            ("What does HTTPS use to encrypt the connection?",
             "HTTPS সংযোগ এনক্রিপ্ট করতে কী ব্যবহার করে?",
             ["SSL/TLS", "RSA", "AES", "DES"],
             ["SSL/TLS", "RSA", "AES", "DES"],
             0),
            ("Why should you look for https:// before entering personal info?",
             "ব্যক্তিগত তথ্য দেওয়ার আগে https:// খোঁজার কারণ কী?",
             ["It makes the site load faster", "It encrypts your data in transit", "It saves your information", "It's required by law"],
             ["এটি সাইটকে দ্রুত লোড করে", "এটি আপনার ডেটা ট্রানজিটের সময় এনক্রিপ্ট করে", "এটি আপনার তথ্য সংরক্ষণ করে", "এটি আইন অনুযায়ী বাধ্যতামূলক"],
             1),
        ],
        [
            ("What does the 'S' in STRIDE stand for?",
             "STRIDE-এর 'S' কী বোঝায়?",
             ["Spoofing", "Security", "System", "Service"],
             ["স্পুফিং", "সিকিউরিটি", "সিস্টেম", "সার্ভিস"],
             0),
            ("What is 'Tampering' in STRIDE?",
             "STRIDE-এ 'ট্যাম্পারিং' কী?",
             ["Pretending to be someone else", "Modifying data", "Denying an action", "Leaking information"],
             ["অন্য কারও সেজে ফাঁকি দেওয়া", "ডেটা পরিবর্তন করা", "কাজ অস্বীকার করা", "তথ্য ফাঁস করা"],
             1),
            ("What threat type involves denying you did something?",
             "কোন হুমকি প্রকার আপনি কিছু করেছেন তা অস্বীকার করাকে বোঝায়?",
             ["Spoofing", "Tampering", "Repudiation", "Information Disclosure"],
             ["স্পুফিং", "ট্যাম্পারিং", "রিপুডিয়েশন", "ইনফরমেশন ডিসক্লোজার"],
             2),
            ("Why is threat modeling useful even for non-professionals?",
             "পেশাদার না হয়েও থ্রেট মডেলিং কেন উপকারী?",
             ["It makes you a hacker", "It helps you spot potential risks before they happen", "It's only for IT teams", "It replaces antivirus"],
             ["এটি আপনাকে হ্যাকার বানায়", "এটি ঝুঁকি ঘটার আগেই শনাক্ত করতে সাহায্য করে", "এটি শুধু আইটি দলের জন্য", "এটি অ্যান্টিভাইরাস প্রতিস্থাপন করে"],
             1),
        ],
        [
            ("What is a primary function of a firewall?",
             "ফায়ারওয়ালের একটি প্রাথমিক কাজ কী?",
             ["To increase internet speed", "To block unauthorized network traffic", "To download files", "To manage passwords"],
             ["ইন্টারনেটের গতি বাড়ানো", "অননুমোদিত নেটওয়ার্ক ট্রাফিক ব্লক করা", "ফাইল ডাউনলোড করা", "পাসওয়ার্ড পরিচালনা করা"],
             1),
            ("What does a VPN hide from your ISP?",
             "VPN আপনার ISP থেকে কী লুকায়?",
             ["Your IP address only", "Your browsing activity", "Your device model", "The time of day"],
             ["শুধু আপনার আইপি ঠিকানা", "আপনার ব্রাউজিং কার্যকলাপ", "আপনার ডিভাইসের মডেল", "দিনের সময়"],
             1),
            ("Why should you use a VPN on public Wi-Fi?",
             "পাবলিক ওয়াই-ফাইতে VPN ব্যবহার করার কারণ কী?",
             ["It makes the internet faster", "It encrypts your data and hides it from others on the same network", "It blocks ads", "It saves battery"],
             ["এটি ইন্টারনেট দ্রুত করে", "এটি আপনার ডেটা এনক্রিপ্ট করে এবং একই নেটওয়ার্কে থাকা অন্যদের থেকে লুকিয়ে রাখে", "এটি বিজ্ঞাপন ব্লক করে", "এটি ব্যাটারি বাঁচায়"],
             1),
            ("Which cybersecurity career path involves actively trying to hack systems to find weaknesses?",
             "কোন সাইবার নিরাপত্তা ক্যারিয়ার পাথে সক্রিয়ভাবে দুর্বলতা খুঁজতে সিস্টেম হ্যাক করার চেষ্টা করা হয়?",
             ["Security Analyst", "Penetration Tester", "Security Engineer", "GRC Specialist"],
             ["সিকিউরিটি অ্যানালিস্ট", "পেনিট্রেশন টেস্টার", "সিকিউরিটি ইঞ্জিনিয়ার", "GRC স্পেশালিস্ট"],
             1),
        ],
        [
            ("Which certification is commonly pursued for a career in cybersecurity in Bangladesh?",
             "বাংলাদেশে সাইবার নিরাপত্তায় ক্যারিয়ারের জন্য সাধারণত কোন সার্টিফিকেশন অনুসরণ করা হয়?",
             ["CompTIA Security+", "MBA", "CFA", "PMP"],
             ["CompTIA Security+", "এমবিএ", "সিএফএ", "পিএমপি"],
             0),
            ("What is the most important trait for starting a cybersecurity career?",
             "সাইবার নিরাপত্তা ক্যারিয়ার শুরু করার জন্য সবচেয়ে গুরুত্বপূর্ণ বৈশিষ্ট্য কী?",
             ["Coding genius", "Curiosity and willingness to learn", "A master's degree", "Knowing 10 programming languages"],
             ["কোডিং প্রতিভা", "কৌতূহল এবং শিখতে ইচ্ছুকতা", "মাস্টার্স ডিগ্রি", "১০টি প্রোগ্রামিং ভাষা জানা"],
             1),
            ("What is a realistic first step toward a cybersecurity career?",
             "সাইবার নিরাপত্তা ক্যারিয়ারের দিকে একটি বাস্তবসম্মত প্রথম পদক্ষেপ কী?",
             ["Wait for a job offer", "Start learning and building projects", "Buy expensive equipment", "Join a hacking group"],
             ["চাকরির অফারের জন্য অপেক্ষা করুন", "শেখা শুরু করুন এবং প্রজেক্ট তৈরি করুন", "দামি সরঞ্জাম কিনুন", "হ্যাকিং গ্রুপে যোগ দিন"],
             1),
            ("Why is Bangladesh a good place to start a cybersecurity career?",
             "বাংলাদেশ সাইবার নিরাপত্তা ক্যারিয়ার শুরুর জন্য কেন একটি ভালো জায়গা?",
             ["There are no jobs", "The demand is high and growing", "It's easy to get certified", "Companies don't need security"],
             ["কোনো চাকরি নেই", "চাহিদা বেশি এবং বাড়ছে", "সার্টিফিকেট পাওয়া সহজ", "কোম্পানিগুলোর নিরাপত্তার প্রয়োজন নেই"],
             1),
        ],

    ]

    # -------------------------
    # 4. Insert lessons and quizzes
    # -------------------------
    for i, (title_en, title_bn, content_en, content_bn, minutes) in enumerate(lessons_data):
        # Assign tier based on index
        if i < 5:
            tier = tier0
            order_index = i + 1
        elif i < 11:
            tier = tier1
            order_index = i - 4
        elif i < 17:
            tier = tier2
            order_index = i - 10
        else:
            tier = tier3
            order_index = i - 16

        existing = db.query(Lesson).filter(
            Lesson.tier_id == tier.id,
            Lesson.title_en == title_en
        ).first()
        if existing:
            print(f"⏩ Skipping existing lesson: {title_en}")
            continue

        lesson = Lesson(
            tier_id=tier.id,
            title_en=title_en,
            title_bn=title_bn,
            content_en=content_en,
            content_bn=content_bn,
            order_index=order_index,
            estimated_minutes=minutes,
        )
        db.add(lesson)
        db.commit()
        db.refresh(lesson)

        for q_en, q_bn, opts_en, opts_bn, correct_idx in quizzes_data[i]:
            db.add(QuizQuestion(
                lesson_id=lesson.id,
                question_en=q_en,
                question_bn=q_bn,
                options_en=opts_en,
                options_bn=opts_bn,
                correct_option_index=correct_idx,
            ))
        db.commit()
        print(f"✅ Inserted lesson: {title_en}")

    print(f"🎉 Seeding complete. Total lessons: {len(lessons_data)}")
    db.close()


if __name__ == "__main__":
    seed()