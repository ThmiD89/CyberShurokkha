from database import SessionLocal
from models import LessonTier, Lesson, QuizQuestion

def seed():
    db = SessionLocal()

    existing = db.query(LessonTier).count()
    if existing > 0:
        print(f"lesson_tiers already has {existing} rows — skipping seed to avoid duplicates.")
        db.close()
        return

    # --- Create Tier 0 ---
    tier0 = LessonTier(
        name_en="Digital Basics",
        name_bn="ডিজিটাল বেসিক্স",
        order_index=0,
        unlock_requirement=0,  # unlocked by default
    )
    db.add(tier0)
    db.commit()
    db.refresh(tier0)

    # --- Lesson data: (title_en, title_bn, content_en, content_bn, minutes) ---
    lessons_data = [
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
    ]

    quizzes_data = [
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
    ]

    for i, (title_en, title_bn, content_en, content_bn, minutes) in enumerate(lessons_data):
        lesson = Lesson(
            tier_id=tier0.id,
            title_en=title_en,
            title_bn=title_bn,
            content_en=content_en,
            content_bn=content_bn,
            order_index=i + 1,
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

    print(f"Seeded 1 tier, {len(lessons_data)} lessons, and {sum(len(q) for q in quizzes_data)} quiz questions.")
    db.close()

if __name__ == "__main__":
    seed()