// Curated from KTMG's Yelp listings, collected 2026-09-25.
//
// Only 5-star reviews are included, per the client's explicit direction.
// Rows were dropped, not just filtered, for two data-quality reasons found
// in the source sheet:
//   - Every "Santa Monica" row was a verbatim duplicate of a San Fernando
//     row (same reviewer, same text, referencing San Fernando's own
//     doctor), a copy/paste error upstream, not real Santa Monica content.
//     Santa Monica has no reviews here as a result.
//   - One Glendale reviewer's name was saved as literal "?" characters in
//     the source export and is not recoverable; that review is excluded
//     rather than published with an unreadable name.
//
// Five clinics (Camarillo, Hollywood, San Pedro, Tarzana, La Mirada) have
// no reviews yet, the client has not collected them. Locations without an
// entry here simply render no Yelp Appreciation section.
//
// locationId values match data/locations.ts ids.
export type YelpReview = {
  locationId: string;
  reviewer: string;
  rating: number;
  /** ISO date (yyyy-mm-dd) the review was posted on Yelp. */
  date: string;
  text: string;
};

export const yelpReviews: YelpReview[] = [
  {
    locationId: "agoura-hills",
    reviewer: "Jane A.",
    rating: 5,
    date: "2024-08-20",
    text: `Dr. Snyder and Mr. Eduardo are a reliable, professional, courteous team. They are an essential support to the wellbeing of my family.`,
  },
  {
    locationId: "agoura-hills",
    reviewer: "Lisa T.",
    rating: 5,
    date: "2024-09-13",
    text: `Dr.Snyder is always there to help our family for the last 10 plus years. He has always listened to my children as they explain their health concerns.The office staff are also very professional.`,
  },
  {
    locationId: "agoura-hills",
    reviewer: "M. B.",
    rating: 5,
    date: "2024-08-24",
    text: `Dr is very thorough, patient & kind. Have used him for kids ages 8 to 15 yrs old, for seven years. The new office building is very clean & spacious! Only draw back is the offside phone answering service. They don't speak or understand English well & make mistakes.`,
  },
  {
    locationId: "arcadia",
    reviewer: "Le C.",
    rating: 5,
    date: "2024-07-27",
    text: `Quick with response whether it's via text or email. Claudia at the front desk is THE BEST and so knowledgeable.`,
  },
  {
    locationId: "arcadia",
    reviewer: "Stacey P.",
    rating: 5,
    date: "2024-03-25",
    text: `I've been with kids and teens for over 8 years and can't complain: my son was a patient first then my daughter comes here now too: we were going to the Pasadena office for years until we started to come to the Arcadia office. The doctors are very friendly and very understanding. They move quickly with appointments and referrals.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Anabel R.",
    rating: 5,
    date: "2019-08-29",
    text: `Came her for my child's 4 month physical. Front office staff is really friendly and welcoming . Dr. Dasovich was amazing answered all my questions and concerns i had . This office is great ,looking forward to our next visit.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Blair L.",
    rating: 5,
    date: "2024-08-10",
    text: `Appointments are always available even same day! There's never a long wait time and the staff is great!`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "HANNY M.",
    rating: 5,
    date: "2019-06-24",
    text: `Amazing pediatric office, super clean, well organized, very welcoming, high technology, and helpful through the first visit for my son, Dr. Martin Fineberg such a wonderful, knowledgeable and caring physician, the lady in the reception is top notch in service.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Jennifer C.",
    rating: 5,
    date: "2023-07-31",
    text: `I have been looking far and high for a clinic that can see my daughter for her well exam visit for her to go back to school as her previous exam expires August 8th. But her original clinic said they can't see her until October, needless to say my daughter will be dropped by then from her school unless I can give them an updated exam. Thankfully, at Kids & Teens Medical Group they were so accommodating with their appointment and to top it off they took care of the whole insurance switch I practically just had to give consent and approve. While in other clinics they usually tell you "call your insurance and tell them to switch with us and call us back when you do". They helped with everything here. Great way to make such a tedious process a little easier.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Jessica E.",
    rating: 5,
    date: "2023-08-21",
    text: `I love the New Office in West Hollywood and there is enough parking. The staff is super friendly and very welcoming. My 4 year old month baby had his vaccines and great job to the nurse, my baby didnt cry`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Jordanae W.",
    rating: 5,
    date: "2023-08-04",
    text: `Really great Doctor's office that takes care of my son's needs. I'm always able to get a quick appointment if I have any concerns. The front desk employees Eric and Diana are always helpful and Dr. Feinberg is always helpful and knowledgeable whenever I have questions. Would recommend to everyone.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Madison S.",
    rating: 5,
    date: "2023-11-15",
    text: `We see Dr. Sharmetha and absolutely love her. I won't take my kids to anyone else. She's the sweetest. Goes over and beyond to make them comfortable at the doctor's office and is very thorough in addressing our concerns. Erick is kind and so good with the kids.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Sara B.",
    rating: 5,
    date: "2020-06-15",
    text: `My daughter needed to switch pediatricians. We found this office through our insurance network. Today was our first visit and we could not have been more pleased. Dr Dasovich was so kind and helpful and answered every question we had! The staff was also very kind and followed covid protocol. After today's visit, I'd highly recommend Dr Dasovich to anyone!`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Sarah S.",
    rating: 5,
    date: "2023-08-01",
    text: `I highly recommend! My former pediatrician was always difficult to get into and Kids and Teens has multiple Doctors so I've never had any trouble getting a last minute appointment.`,
  },
  {
    locationId: "beverly-hills",
    reviewer: "Tony T.",
    rating: 5,
    date: "2024-08-09",
    text: `I been there Atleast dozen of times . A to Z just a perfect clinic . Doctors are really caring and knowledgeable. Top +++`,
  },
  {
    locationId: "canyon-country",
    reviewer: "Holly P.",
    rating: 5,
    date: "2026-08-24",
    text: `Bania provides great customer service! She has helped me tremendously with everything and I've had great experiences. Every single time I interact with her, she is professional, kind, incredibly welcoming and is always eager to help. We truly appreciate her and all she does!`,
  },
  {
    locationId: "culver-city",
    reviewer: "Jamuna M.",
    rating: 5,
    date: "2023-09-14",
    text: `Dr. Reyna is an absolute gem of a doctor! She is so professional and very respectful of our choices as a parent. She has been the doctor of our daughter since she was 2 years old. I cannot be more happier. She is very gentle with our little one and very reassuring.

A special shout out to the nurses and staff who are equally caring, responsive and mindful of us. Highly recommend them.`,
  },
  {
    locationId: "culver-city",
    reviewer: "Rosie M.",
    rating: 5,
    date: "2024-03-19",
    text: `Been coming to kids and teens for the past year. Alondra always has a smile on her face and treats us with a lot of enthusiasm and respect, our provider Monique is very thorough. We appreciate them.`,
  },
  {
    locationId: "culver-city",
    reviewer: "Yedani J.",
    rating: 5,
    date: "2023-09-14",
    text: `I come to this clinic in Culver Culver City and the service they provide is very good and the staff treats you very friendly`,
  },
  {
    locationId: "culver-city",
    reviewer: "Yvonne F.",
    rating: 5,
    date: "2024-09-05",
    text: `Brought my daughter for a sports physical. Made appointment at 9:00am and we were out by 9:30am. Didn't have to wait long for check-up. Girls in front desk were helpful and nice. I like how I can make appointment on website and choose doctor and time that works for me. Only con would be filling out long forms online before appointment but besides that everything went well.`,
  },
  {
    locationId: "downey",
    reviewer: "Arely B.",
    rating: 5,
    date: "2024-04-12",
    text: `Yesterday was my first visit with this provider. I swapped my insurance to this clinic hoping that I would find a new pediatrician for my daughter who suffers from bad eczema. PA Oliver helped us out and I definitely recommend him to any parents looking for an empathetic provider. He listened to my complaints, examined all of my daughter's eczema spots and immediately submitted a request for a referral. I am beyond happy considering her last two pediatricians couldn't be bothered to send us to a derm and allergist after a year of seeing them. Even after seeing how bad her skin gets. Terry at the front desk was also a sweetheart, so kind and helpful. I am definitely looking forward to continuing care at this clinic. Thank you Oliver and Terry!

Also, they booked me for a same day appointment! This is the reason I made my insurance retroactive immediately to be able to see them.`,
  },
  {
    locationId: "downey",
    reviewer: "Lina S.",
    rating: 5,
    date: "2024-12-04",
    text: `Came from previous terrible experience with doctors so was warry. The staff were friendly which i appreciated, didn't take too long as well to serve us. I appreciate the later hours Available.`,
  },
  {
    locationId: "glendale",
    reviewer: "Adriel Y.",
    rating: 5,
    date: "2025-02-06",
    text: `They are a super supportive team (Maggie, Dr. Brandt). It's easy to make an appointment online including same day. Their bedside care is comforting and holistic. We are appreciative to have found pediatric office that works with and for our family.`,
  },
  {
    locationId: "glendale",
    reviewer: "Ben L.",
    rating: 5,
    date: "2024-07-23",
    text: `Dr Brandt has been our child's primary care physician for over a year she's the best. Highly recommend her, she's such a compassionate and grounded and caring doctor.`,
  },
  {
    locationId: "glendale",
    reviewer: "Crystal G.",
    rating: 5,
    date: "2023-08-03",
    text: `Very helpful ladies at the front desk! Diane and Jackie made my son feel comfortable and welcomed! Happy to have the change!`,
  },
  {
    locationId: "glendale",
    reviewer: "Elisha Y.",
    rating: 5,
    date: "2025-08-11",
    text: `My son is now 5 and has been under the care of Dr Emily Brandt since he was 2. This clinic and Dr Emily are truly a godsend. Attentive, kind and detail oriented. Highly recommend!`,
  },
  {
    locationId: "glendale",
    reviewer: "Farangiz U.",
    rating: 5,
    date: "2026-06-11",
    text: `I visited here to see doctor Molly Grigorian. She is highly professional, knowledgeable and compassionate in her work. My baby was crying non stop during the visit, she was so patient and very gentle with baby. I would highly recommend her to other families seeking a caring and professional healthcare provider!`,
  },
  {
    locationId: "glendale",
    reviewer: "Jessica A.",
    rating: 5,
    date: "2023-11-01",
    text: `We really like this facility my kids love Dr Brant !!!! She makes them feel so comfortable and that to me is a relief I feel that she listens and she is very concern about her patients ! Natalie is super friendly too it makes our appointment so easy ! Overall we love kids and teens !!!!`,
  },
  {
    locationId: "glendale",
    reviewer: "Melissa P.",
    rating: 5,
    date: "2024-05-01",
    text: `By far my favorite pediatrician office for my kids. Have been taking my daughter and son since they were newborns and Dr. Chan and Emily are amazing, caring and resourceful. Diana from the office staff is always so friendly and efficient, Highly recommend and very trustworthy!`,
  },
  {
    locationId: "glendale",
    reviewer: "Sabrina L.",
    rating: 5,
    date: "2024-04-01",
    text: `The front office receptionist Diana assisted me with the forms I needed for my children's pre school . It was a great experience she worked everything out for me and my son in a professional matter .`,
  },
  {
    locationId: "glendale",
    reviewer: "T C.",
    rating: 5,
    date: "2024-04-11",
    text: `My children are patients of Emily Brandt and the quality of care is outstanding. They are old pediatrician Dr Choa Chan retired and We decided to give the new pediatrician a chance. I am so glad that she took over. She is very caring. Listens to our concerns and communication is amazing. Just wish I could contact them directly instead of the 800 number. Office is super clean. Everything is sanitary.`,
  },
  {
    locationId: "glendale",
    reviewer: "Vanessa M.",
    rating: 5,
    date: "2023-08-18",
    text: `My son has been coming to this office for the past three years, Dr. Brant and Jackie are amazing! I definitely recommend this office. They're so friendly and take their time with the patients. Best pediatric office I've ever been to!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Aida A.",
    rating: 5,
    date: "2023-11-16",
    text: `Perfect place to go for. I have 2 teens , was a good experience for them and me. Nurses , Dr was very friendly, helpful and knowledgeable. 100% recommend. On time and top of everything.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Chris P.",
    rating: 5,
    date: "2021-09-17",
    text: `We absolutely LOVE kids and teens. My wife and I have been taking our daughter there for the past 7 years. Every single time we visit everyone is so pleasant, they know my daughter very well and treat us like family. Dr Park, Dr Harder and the entire staff at both La Cañada and Pasadena locations are amazing to say the least! The doctors are genuinely concerned and take time out of their busy schedules to at least jump on a zoom call if we need them. Thank you to the entire Kids and Teens staff, we are so grateful keep up the great work!!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Daniyah S.",
    rating: 5,
    date: "2024-04-04",
    text: `This office is ALWAYS professional. The whole team shows soo much care and such a quick responce to any questions or concerns.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Destiny L.",
    rating: 5,
    date: "2023-05-21",
    text: `Love the staff, everyone is nice and welcoming! Since the first time I started taking my kids to this location I knew this would be the one I wanted them to stay at. The Dr my kids see here is very sweet and kind and she takes her time in listening to her patients , and that I appreciate.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Gretchen B.",
    rating: 5,
    date: "2017-06-20",
    text: `Would not take my kids anywhere else! Very clean and new office. My kids have been patients since the Dr. Fleiss days.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Jean L.",
    rating: 5,
    date: "2019-04-19",
    text: `We LOVE Dr. Harder and her staff. We have followed her from two offices ago and know that it's been the right decision. She has that rare balance of professionalism with caring that is not easy to find. And she has always made my kids feel super comfortable. The nurses and office staff are also phenomenal, kind, and engaging with kids. This office is a gem.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Jennifer G.",
    rating: 5,
    date: "2018-01-10",
    text: `Amazing staff and doctors. I highly recommend Dr. Harder and her staff! Dr. Harder is knowledgeable and takes her time to figure out the problem. My daughter had breathing problems and we were constantly in the ER, when we switched pediatricians Dr. Harder was able to diagnose her and come up with a treatment plan that worked for my child. She has been a blessing to our family! Her nurses are also so great with kids and parents! I love this office, even though it is quite a way from home she is worth it!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Jolie S.",
    rating: 5,
    date: "2018-10-03",
    text: `I called and made a same day appointment for my toddler and 3 month old. The receptionist was friendly and helpful and gave us an appointment within the hour if we wanted it. The street was clean and felt safe. There were plenty of parking spots in the morning but around noon the customers from the diner next door were using most of the available spaces. The office was clean and had lots of toys. The front desk staff was so friendly and polite. The registration process was easy and straightforward. The staff showed me a room I could nurse in with a rocking chair and ottoman. I didn't have to wait in the waiting room the nurse came in immediately after I finished registering on their tablet. The entire staff was so encouraging of breastfeeding. The nurses and doctors spoke to my children during the appointment and not just me. Too often medical staff don't make eye contact or engage with their little patients. The nurse administering the vaccines is AMAZING! My kids didn't cry. This office is wonderful.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Jonathan M.",
    rating: 5,
    date: "2023-09-18",
    text: `We love this place and will write a full review later. For now we want to vote for MAGGIE as our favorite nurse! She is amazing and the whole team makes each visit a joy!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Julie C.",
    rating: 5,
    date: "2019-08-01",
    text: `I never write reviews but I had to because I had the most amazing experience this week. I needed help with a referral and spoke with Melanie from the referral/authorization department. Melanie went out of her way to help me. She was kind, respectful, understanding and trustworthy. Everything she told me she would do, she did. She cares about her job and the patients. I've never seen anyone in the medical field work as hard, and get things done so fast. She is the reason I'm keeping my kid with this medical group!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Kari M.",
    rating: 5,
    date: "2016-10-19",
    text: `No one wants to go to the doctor but some times it is necessary. This little gem is tucked on the south side of Foothill and shares a parking lot with Magpie's Grill (so you can grab lunch after!). It's a very clean, adorable new branch of Kids & Teens Medical Group. So far, the wait times are shorter than the Pasadena location, there's spacious exam rooms and most importantly the same great doctors & medical assistants that we've come to know from the Pasadena office. My daughter loved the train table, crayons & easel in the waiting area and the toys and books in the fishy exam room. Tip: closed on Wednesdays and no urgent care.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Kathy H.",
    rating: 5,
    date: "2023-09-14",
    text: `Ive always loved Kids and Teens. This site is particularly good- especially my sons favorite nurse Angie!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Kyoung L.",
    rating: 5,
    date: "2023-09-05",
    text: `The nurses were kind and pleasant. They know what I needed and keep checking on me what else they can do. I wish my kids are younger enough to keep going this office more but this year would be the last year to visit here.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Liz C.",
    rating: 5,
    date: "2018-03-15",
    text: `Dr. Harder is simply amazing! We have been with her since day 1 of our son being born and we cannot be happier. The La Canada office is a hidden gem. Never busy and they can always squeeze us in when we need it! The staff here is also some of the nicest people I've met. Definitely a rarity in the medical business.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Melodi T.",
    rating: 5,
    date: "2022-06-05",
    text: `First and foremost, I would like to take this time to thank Dr. Le and her staff at Kids and Teen Medical Group, La Canada. Dr. Le has gone above and beyond in caring for our little Zoe, providing her with the best medical attention. Dr. Le exhibits professionalism and strong attention to detail. Thank you Dr. Le for going above and beyond. We appreciate you more than you know :)`,
  },
  {
    locationId: "la-canada",
    reviewer: "Nicola G.",
    rating: 5,
    date: "2024-10-08",
    text: `we have been going to kids and teens since they took over Dr. Flight's office in Los Feliz Hillhurst Avenue then we transferred to the Pasadena kids and teens, Encino kids and teens due to school location and now the Ada kitten teens on foothill Boulevard
I've had to wait longer than 45 minutes for walk-ins. The systems are able to pull up your history quickly. The staff are usually efficient and friendly, especially in La Cañada one of the clerks remembers my daughter from birth.
Offices are clean with kid friendly images on the walls. Lane has two separate waiting rooms which is useful if someone is super sick and possibly contagious you can separate yourself.
is usually specific they spend a little more time with you than normal and explain your options of treatment`,
  },
  {
    locationId: "la-canada",
    reviewer: "Ninel C.",
    rating: 5,
    date: "2024-07-18",
    text: `Tatiana was great and knowledgeable! Always a great experience with her . She gave me good information and responds immediately.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Noemi R.",
    rating: 5,
    date: "2019-02-01",
    text: `I have taken my son and daughter here for the first time and it was by far the best experience. The staff was amazing. Dr. Dasovich and Dr. De Silva were both amazing. They answered all my concerns and questions. I will definitely reccomend any parents looking for a great staff and office.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Nora T.",
    rating: 5,
    date: "2017-10-16",
    text: `We recently visited the La Canada office as we wanted a pediatrician closer to home. Pleasantly surprised! Dr. Harder was wonderful and patient with my daughters, as was the nurse (apologies for not catching her name). Appointments are easy to make and you don't have to wait weeks (or months!) for an opening. New patient information and payment all handled efficiently on a tablet. Very glad we came across this office. Thanks, KT Medical team!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Nune G.",
    rating: 5,
    date: "2024-07-18",
    text: `I had a great experience. We have been with the office since my daughter was born . Tania is the employee I interacted with most who has assisted me with all my requests and concerns. Highly recommend Kids and Teens and their staff.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Patricia Diva L.",
    rating: 5,
    date: "2025-02-27",
    text: `Tatiana is amazing she always focus on my DAUGHTER health. It is a pleasure to meet with her. Thank you so very much`,
  },
  {
    locationId: "la-canada",
    reviewer: "Petra D.",
    rating: 5,
    date: "2023-07-05",
    text: `t's a great medical office! I started at Pasadena since Kids and Teens started . La Canada is the office where I know I would love to keep coming ! The environment is always friendly and welcoming in every doctors visits ! Doctors are great ! Angie is always a great very helpful and warm person!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Ruby T.",
    rating: 5,
    date: "2023-11-09",
    text: `There aren't enough positive words I can say about Kids & Teens -La Canada. Dr. De Silva is our pediatrician and she provides the best care. She never rushes us out of the office and takes time to listen to the questions we have and answers them thoroughly. Her patience and calm demeanor is truly appreciated. In addition, Angie and Maggie are both truly amazing nurses! They are both very loving and sweet! Making an appointment with them is a breeze! There have been times I needed an emergency appt and they accommodated to my schedule right away. I cannot thank them enough for all their hard work! They always make sure that their patients leave the office happy. Highly recommended!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Ryan D.",
    rating: 5,
    date: "2024-10-16",
    text: `Great team, super calming to work with, the front desk worked great with us to get vaccinations needed in time for the school year, to get physical examination needed in time for volleyball. Great, small office but they know what they're doing.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Sara G.",
    rating: 5,
    date: "2023-06-29",
    text: `We love coming to this location of Kids and Teens! I can easily schedule an appointment online and get in quick. Everyone is so friendly and efficient! We LOVE nurse Angie!! Shes our favorite! :) She's always so friendly to my kids and goes out of her way to make them feel comfortable and safe. Grace Yi, NP, has been so helpful in treating any illnesses or symptoms we've come in with. She takes the time to ask thorough questions and also makes sure all my questions are answered. The office itself is very clean and spacious. Plenty of parking available.

We can't thank the nurses and doctors at Kids and Teens La Cañada enough for all there thoughtful care they have given our family! You guys rock!!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Shante Y.",
    rating: 5,
    date: "2019-01-11",
    text: `Our family loves Dr. Harder!!!! We have followed her and are very grateful to have found her. She does a great job of engaging kids in being an advocate for their own health from a young age but still makes time for the parents and any questions. She takes the time to answer questions and be sure you have a good understanding of any items needed before you leave. I love that their office makes using insurance a breeze and are good about getting paperwork done in a timely fashion.

The La Canada office is clean and had a well and sick waiting area. It has nicely decorated and clean exam rooms and free parking. There is an odd smell in the office that I cannot place and I think the tablet check in is a complete waste of time and goes so very slow but all in all we are very happy.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Stephani O.",
    rating: 5,
    date: "2019-07-26",
    text: `Last Thursday my daughter and I took a bus to this doctors office for the first time ever for an appointment we had made online. Unfortunately, the front desk told us they could not see us because my daughters medical had a different provider listed under her account. Regardless, they were very nice, printed my daughters eligibility information which had the medical phone number on it and gave us information on how to switch over to their office. They also offered us cold water and bus money (we kindly declined the money since we had already arranged a ride back home before my phone died). I was so impressed with their kindness that I have now switched over to this doctors office. Thank you ladies !!`,
  },
  {
    locationId: "la-canada",
    reviewer: "Tracey C.",
    rating: 5,
    date: "2018-01-09",
    text: `Can't say enough nice things about Dr. Harder. She not only takes great care of our little one, she takes great care of the parents as well which is huge and also makes a ton of sense. She's helped us tackle, colic, lactation problems (supportive of breastfeeding but doesn't push one way or another), sleeping issues, and she's never chided us when we've come in with what turned out to be false alarmsssssss.

Choosing to be a pediatrician means you are already a pretty amazing person to begin with and we're so so glad we've found her. The facility is also very clean, with lots of toys and very friendly nursing and support staff. Being a little kid means getting lots of shots and they've always been so empathetic and gentle with our kid (now almost two years old).`,
  },
  {
    locationId: "la-canada",
    reviewer: "Wendy C.",
    rating: 5,
    date: "2018-05-17",
    text: `I love it here and my daughter too! It was recommended by my cousin since I had a bad experience with my daughters pediatrician when she was born. Dr. Harder is my daughter pediatrician and I love her! She's very understanding and informative. As a first time mother, we can sometimes become annoying lol with questions & concerns but she has no problem answering them & making sure I understand everything. She has patience for first time Mother's which is great! We tend to overreact a bit when our babies are sick lol but she will assure & take care of everything. The staff is great too! Never had a problem scheduling an appt or getting things done.`,
  },
  {
    locationId: "la-canada",
    reviewer: "Wendy T.",
    rating: 5,
    date: "2023-07-17",
    text: `We love it here-when your kids are sick and miserable, they are always kind and patient! Also, it's easy to get appointments and usually you are seen promptly. Especially thankful for Nurse Angie, who always is especially kind and remembers details of previous visits ?`,
  },
  {
    locationId: "la-canada",
    reviewer: "Winston H.",
    rating: 5,
    date: "2024-08-22",
    text: `Dr. De Silva is our pediatrician and has been great. She listens to all of our concerns and does a great job explaining things to us.`,
  },
  {
    locationId: "la-canada",
    reviewer: "gita c.",
    rating: 5,
    date: "2018-03-14",
    text: `We transitioned from Kaiser to Blue Cross and begin seeing Dr. Harder with our three boys, twins ages 10 and 14 year olds. I have been so impressed by the friendlyness of the office staff and the thoroughness of the physical exam. Dr. Harder really took time to ask questions about our children's health and well being. This has been a great find for us and I am extremely happy with the level of care and sevice provided.`,
  },
  {
    locationId: "la-canada",
    reviewer: "kay f.",
    rating: 5,
    date: "2023-08-27",
    text: `Angelica
Is always the best! I've been going to the same doctors since 2006 switching from locations due to moving. I'm currently in Van Nuys and I really don't mind the drive to La Cañada thanks to Angelica, she makes my family feel welcomed and at home.
Angelica always has a positive attitude that keeps us coming back.

I always recommend this location due to their professionalism!`,
  },
  {
    locationId: "mission-hills",
    reviewer: "Aracely C.",
    rating: 5,
    date: "2024-08-19",
    text: `Very wonderful experience the staff and the doctor tamashero are wonderful my girls and i love coming here they are very loving to the kids.`,
  },
  {
    locationId: "mission-hills",
    reviewer: "Karla C.",
    rating: 5,
    date: "2023-02-22",
    text: `Second time coming here and had no problems. I like Dr. Tamashiro and appreciate how he explains everything from the visit. I like his organization method he uses while on the visit/consult. I have been to other locations but I really like his organization methods. I'm very happy with my experience as a new patient to this location. The staff was friendly/helpful the Dr was excellent! The only downside is the parking. There is no parking validation but it's also not expensive. So for those that don't like paying for parking (about $1-$8max) then you can park in the street. Overall I do recommend this location`,
  },
  {
    locationId: "northridge",
    reviewer: "Amanda Z.",
    rating: 5,
    date: "2014-12-28",
    text: `Went today with my 5yr old that hasn't slept in 3 nights do to a bad cough, horrible sore throat, and many other symptoms. I was terrified to come here do to the reviews, but I wasn't going to drag my sick kid on a long drive somewhere else. Everyone from the receptionist, the nurse, to the amazing doctor were better then I could ask for. The sweet gently doctor took her time to be with my daughter to make her comfortable and accurately check her symptoms and diagnose her. Thank you so much for making a tough situation an easy one! I recommend this place to any care giver looking for some after hours help.`,
  },
  {
    locationId: "northridge",
    reviewer: "Armine C.",
    rating: 5,
    date: "2020-05-21",
    text: `We have been seeing Dr Benjamin since my first child was born in 2015, amazing doctor we have built a wonderful relationship now she sees my son as well. She is patient, takes time and answers all questions and provides excellent service. I'm the kind of parent that panics and each time I went to her I left calm and in control! Even now in the pandemic she kept me calm and collected with my son! I recommend her highly! The office has great staff and everything is clean and everyone is very helpful.`,
  },
  {
    locationId: "northridge",
    reviewer: "Diana D.",
    rating: 5,
    date: "2022-11-18",
    text: `We had to do a blood test for our daughter and lab worker was very nice and gentle with my daughter, thanks for make in it so easy .`,
  },
  {
    locationId: "northridge",
    reviewer: "Gabrielle R.",
    rating: 5,
    date: "2014-12-14",
    text: `My son had a fever of 102.3. I was extremely worried especially for this to be happening over the weekend. I am so grateful for Kids and Teens Urgent Care staff and doctors. The check in was less than 3 minutes and my son was seen by the doctor within 10 minutes. Thankfully, my son will be just fine and was given medication onsite. The doctor was thorough, loving, and attentive and knowledgeable. I would highly recommend Kids ans Teens for any parents!!!!`,
  },
  {
    locationId: "northridge",
    reviewer: "Jacky Q.",
    rating: 5,
    date: "2024-08-12",
    text: `Everything went well today, I now know to book my appt first thing in the morning to get in and out
I would usually book my appts at 11 or after 2 and I would be there for hours but lately things have been going great since I've been booking early in the morning`,
  },
  {
    locationId: "northridge",
    reviewer: "Jason M.",
    rating: 5,
    date: "2015-01-17",
    text: `This place was very helpful. Was a little turned off at first glance when I noticed a broken toy train track going throughout the facility. However the office staff was very helpful. My new crappy insurance that over charges for my visit had me a bit bummed. The office staff made some calls and saved me some money. The Dr. Who's name I can't remember was super friendly and comforting to my daughter. This is without a doubt one of the nicest urgent cares I have been too. Very clean and super friendly.`,
  },
  {
    locationId: "northridge",
    reviewer: "Lauren W.",
    rating: 5,
    date: "2024-08-08",
    text: `Dr Benjamin best doctor caring patient so knowledgeable.

Britanny medical assistant very patient throughly and very kind`,
  },
  {
    locationId: "northridge",
    reviewer: "Linda C.",
    rating: 5,
    date: "2014-12-14",
    text: `The Doctor was very thorough in understanding my son's symptoms and ran the necessary tests. She was very personable and made extra effort at establishing a good rapport with my son from the minute she entered the exam room. My son's medical issue was taken care of in a timely and efficient manner. The office staff was also friendly and provided clarification for all the paper work and billing issued. We went in on a Saturday evening and were in and out in half an hour.`,
  },
  {
    locationId: "northridge",
    reviewer: "Mama G.",
    rating: 5,
    date: "2024-02-29",
    text: `Been coming here for years the service quick professional and thorough ... the staff top notch`,
  },
  {
    locationId: "northridge",
    reviewer: "Martha G.",
    rating: 5,
    date: "2023-03-19",
    text: `Dr Benjamin is the best she so nice and patient and help with parents what we need to do or have for our kids. am so grateful to have her`,
  },
  {
    locationId: "northridge",
    reviewer: "Owen D.",
    rating: 5,
    date: "2012-05-03",
    text: `Our baby whos 3 got a terrible cough in the evening and was wheezing bad, very scary. We called our regular doctor and of course answering service. We didnt want to wait at the local hospital ER all night, we went to Pediatric Urgnet Care and were seen in less then 5 minutes by a very nice doctor. She knew right away what was happening, calmed our daughter down made her feel better and all is well. Very clean Office, easy parking and a GREAT Childrens DOCTOR. Was also pleased to find out they have other programs for children, and they called the next day to "check up" on our daughter. Cost was resonable, and they took our insurance which was great, and not alot of forms.`,
  },
  {
    locationId: "northridge",
    reviewer: "Pam B.",
    rating: 5,
    date: "2024-09-11",
    text: `We have always had a great experience at K&T Northridge. Very easy to set an appointment and waiting time is not that long. Care quality is awesome for us. Shoutout to Dr. Brian Bhatt for being amazing. Our kids love him!`,
  },
  {
    locationId: "northridge",
    reviewer: "Rachel W.",
    rating: 5,
    date: "2015-02-04",
    text: `January 17th my daughter scout said she had a sore throat&I brought her to urgent care.we were seen quite quickly and the doctor was wonderful,very cheerful.I wouldn't take my daughter anywhere else.`,
  },
  {
    locationId: "northridge",
    reviewer: "Rebecca R.",
    rating: 5,
    date: "2015-02-04",
    text: `This is the best place to take your children to be seeing when you don't want to wait for long periods of time in the Emergency Room and your Doctor is out. Very friendly staff and Providers are the best. Very convinient hours They are open 6pm-10pm Monday-Friday and on The Weekends they're open from 12:00noon- 10:00pm.Sorry to see that other persons have not had the same experience as I did. I will bring my children here in the future if is nessesary no doubt.`,
  },
  {
    locationId: "northridge",
    reviewer: "Steffanie S.",
    rating: 5,
    date: "2015-08-10",
    text: `This Urgent Care is AMAZING! First the aesthetics are wonderful. We felt VERY comfortable there. Second, the doctors are TOP NOTCH! We had no wait time, and were given 100% customer service. I recommend this Urgent Care to any parent.`,
  },
  {
    locationId: "northridge",
    reviewer: "Tasha S.",
    rating: 5,
    date: "2026-07-21",
    text: `It was our first visit to Kids & Teens Medical Group, and we had a great experience. The entire process was smooth, and the staff were friendly, accommodating, and patient--especially the front desk staff who helped us (I didn't catch her name). The clinic is clean and well-maintained, and the pediatrician was kind and welcoming.

After moving to Los Angeles, we had to leave the pediatrician who cared for our kids for over a decade. We're so happy to have found our new pediatrician here. My only suggestion is to improve the air circulation, as it felt a bit warm inside.`,
  },
  {
    locationId: "northridge",
    reviewer: "Varduhi V.",
    rating: 5,
    date: "2024-04-06",
    text: `I recently visited Kids and Teens at Northridge, for my infant, and very pleased with the service. The provider was Dr. PALAK SHELAT very lovely young lady. I didn't find anything negative to complain for, besides being treated respectfully and professionally. The front desk employees were great too. the Medical Assistant was great, and most importantly Dr. Palak Shelat pediatrician was great.
Honestly I am really surprised for so many negative reviews for this location. You don't always need to believe everything you read on the internet, it can be very false. It can be people's unreasonable opinions. Be brave and give a chance .`,
  },
  {
    locationId: "northridge",
    reviewer: "Walter P.",
    rating: 5,
    date: "2015-02-13",
    text: `I have to say that being a new parent is tough. I was changing my daughter last night when i noticed that she was bleeding from her belly button. I panicked and called my regular doctor who recommended this place. I called and they were able to give me advice over the phone and brought her in. Once we got there it was very fast to be checked in and be seen. the staff was very friendly. the Doc was great and also was very friendly. I was really happy with the way they treated my princess and will make sure to come here again if needed.`,
  },
  {
    locationId: "northridge",
    reviewer: "Yuki T.",
    rating: 5,
    date: "2024-04-05",
    text: `Wait was short, and they were friendly and helpful. There is a lab next door, which was very convenient as well.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Beatris S.",
    rating: 5,
    date: "2018-08-29",
    text: `Nurse Reyes was awesome on our first visit to that location she was very helpful on helping us. their printer wasn't working but she was able to accommodate our situation . Also nurse Kassandra they both had very welcoming attitudes and I honestly felt very comfortable around them although the doctor I don't know her name we just saw her like 2.5 seconds and that's all . But other than that very satisfied with their customer service. Thank you lady's for being awesome . Again this is at the Kids and Teens Pasadena ca urgent care .`,
  },
  {
    locationId: "pasadena",
    reviewer: "Bree D.",
    rating: 5,
    date: "2014-07-11",
    text: `Recently made this clinic our primary clinic for my daughters. I was slightly skeptical because of the reviews but I was absolutely satisfied with our visit. The front office staff is extremely nice and helpful. My appointment was on time. I am in the medical field and one of the most important things I look at is cleanliness. The office is immaculate as far as doctors offices go, I did not even notice any dust. The Nurse that helped us was great with children and Dr . Rodriguez answered any, and all our questions and we had many of them. They may have only lost a star because of the amount of things to fill out, which I understand, is really not their fault. So for the actual clinic and MD and staff they are 5 stars.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Briana A.",
    rating: 5,
    date: "2014-06-09",
    text: `I have been coming here since I was little and always had the best service here. not sketchy at all`,
  },
  {
    locationId: "pasadena",
    reviewer: "Cece R.",
    rating: 5,
    date: "2014-05-28",
    text: `I have been with Dr. Jackson for over sixteen years. He is honest, caring and knows medicine. He was there to see both my children when they were born at Huntington Hospital. He has been a caring doctor for both of them. He walked my husband and I through difficult decisions and always gave us expert advice and referrals.

Yes, it has changed a little. The medical deductible and payment procedures have changed. This being said, I do not wish to put a price on my children's health or immediate health needs. I was there three weeks ago during a scary medical experience. It was my first time visiting during the new urgent care hours. I waited no more than ten minutes to see an urgent care doctor, on a SUNDAY AFTERNOON!

I was pleased to see Shawna and Juana at the front desk. Shawna assured me that the clinic is still there to provide excellent medical service. When I received the diagnosis I was a little shocked and Shawna provided me with great advice. I love her, her service, her smile and her advice.

I have been to other urgent care centers in Pasadena, this one is perfect for my children!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Christina D.",
    rating: 5,
    date: "2019-01-16",
    text: `I've been coming here for a little under a year and I've been pleased thus far. The average wait time is around 15 minutes which isn't bad considering you're completing a questionnaire on a tablet most of that time.

Dr. Patricia Bast is the absolute best, in my opinion. She is always so friendly, patient, and most importantly, up-to-date on everything. When scheduling your appointment you will see the doctor that is available that day, unless you put in a request to see a particular doctor. If you'd like to see the same doctor on a continual basis don't forget to let the receptionist know or you'll be surprised to be greeted by a different doctor on your next visit, like I was.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Christina M.",
    rating: 5,
    date: "2014-05-13",
    text: `I have been a long time patient of Dr Jackson and was a little hesitant when they transitioned to Kids and Teens but they made the process very easy. The front office was very helpful and explained everything to me and our records were transferred to their system with no problem.
We are also very pleased with Dr De Silva being a patient of Dr Jackson for so long we were a little hesitant but she is really good with kids and she takes her time to explain things and we never feel rushed. Our prescription was electronically sent to the pharmacy which was a big help. I was also very happy to see that some of the old staff is still there nurse Shawna had been our nurse for years and it was very comforting seeing her there after the transition to Kids and Teens.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Deborah H.",
    rating: 5,
    date: "2014-11-18",
    text: `I continue to bring my children in for urgent care my insurance being a PPO, I am obligated to leave a $125 deposit for each visit. The receptionist explained its refundable once my insurance is processed and a payment is received. I was skeptical at first but have received my deposits back all times. They only keep what is my responsibility which is 10% not bad. The staff is great, the nurse on Saturdays is great with the kids .very professional and great bedside manners. Providers alternate shifts you might see a different one each visit. Yet they are all great. Prescription is ready for pick up at Pharmacy of choice.. i highly recommend.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Erik V.",
    rating: 5,
    date: "2014-05-13",
    text: `I took my daughter here, she was well taken care of! The Staff is friendly and Miss Shawna made sure our issues were resolved! I recommend them:) Bravo`,
  },
  {
    locationId: "pasadena",
    reviewer: "Gem J.",
    rating: 5,
    date: "2018-09-18",
    text: `Dr. De Silva and the two ladies at the front are amazing. My mom and I brought my brother and sister to the Beverly Hills location for their annual check up. They are friendly, attentive and knowledgeable. My siblings felt comfortable and were actually excited to be at the doctors office .

As for the location, the office is very clean, colorful and welcoming. We will definitely be returning.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Gretchen B.",
    rating: 5,
    date: "2017-06-14",
    text: `My children were patients of Dr. Fleiss. When they merged with K and T I of course wanted to keep them with the same doctors. I have found they have many times gone way above and beyond for my child (fitting them in, taking a long time to talk to my kids about their concerns etc.) If the wait is too long at the Sierra Madre office, you might want to try their new location in La Canada/Flintridge. Angie from Dr. Fleiss is at that office.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Henry G.",
    rating: 5,
    date: "2023-02-22",
    text: `I had the pleasure of meeting the new NP Sharmetha a few weeks ago at my daughter's physical. I came in again recently and was just so appreciative at how sweet, caring, and patient she is. She took the time to listen to our concerns even though the waiting room was crazy full she still did not rush. She is even nice to some of the rudest patients I've ever seen and always ends visits making sure all of our questions have been answered. My daughter loves her!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Ivy G.",
    rating: 5,
    date: "2015-05-19",
    text: `This is a great place with amazing hours. We have been there a lot and Dr. Harder is a particular gem! My daughter absolutely loves her! Definitely worth a try and nice to have your medical records there in case you need to use their urgent hours.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Jennifer K.",
    rating: 5,
    date: "2015-03-20",
    text: `About a 1 yr 1/2 kids and teens took over children's clinic in Pasadena . The staff is very very patient, kind and very thorough with both of my boys. Quick tip set aside at least 45 min of your time for appointment . Also kids and teens offers after care emergency Svcs. Which I have used at least twice on a weekend services were great .`,
  },
  {
    locationId: "pasadena",
    reviewer: "Julie F.",
    rating: 5,
    date: "2018-03-19",
    text: `Dr. Janesri De Silva is not only a fabulous pediatrician, but she also has a heart of gold. Dr. De Silva gives up some of her very limited free time to provide her expert care to foster youth- she is patient, thorough, and knowledgeable and the kids love her!!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Karen H.",
    rating: 5,
    date: "2013-09-18",
    text: `This medical office is good. I brought both of my children here (ages 2.5 and 3.9). Our doctor is excellent (Dr. DeSi....). Dr. Desi is from India and she is a M.D. not a D.O. She has great knowledge with children. This facility as well as Dr. D are very caring. Also, when you get there to fill out paperwork, the registration is all done with a Tablet so all your information goes directly into their system. I think you can also log into their website to get your medical records and other important info.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Karen L.",
    rating: 5,
    date: "2024-08-16",
    text: `They are alway helpful and get my kiddos in right away. They go above and beyond to help me with health Qs. They are fast with form returns and have the biggest patience in the world. Best Doc group in Pasadena`,
  },
  {
    locationId: "pasadena",
    reviewer: "Karla M.",
    rating: 5,
    date: "2014-05-13",
    text: `i have read all of the reviews for kids and teens and i have to say the negative ones perplex me. my two girls 18 and 13 are both patients here and yes it has been a change from them being childrens clinic.. which i was a patient at over when i was a child over 36 years ago O.o and both my girls have been with dr peter jackson for their entire lives.

i am what you would call a type a parent...not the easiest to deal with because i demand only the best for my girls. i keep meticulous records and have every single dr and hospital visit they have ever had in two notebooks. now saying all of this..the people that could not get records...or had a difficult time with the front obviously in their years of being parents did not feel it important to forge relationships with antoinette...i had a question and was confused with the new procedures when i called and just asked to speak to her and she explained it all to me.
now for nurses... shawna walker to say she is an angel is to put it lightly...i said i am not an easy mother to deal with and she has always always given me respect, undivided attention and knows my voice when i call. she is quick to help me and eases my worries about what is going on with my two precious girls. she gives me peace of mind knowing they are in her VERY capable hands!!
i find the new system of the computer board?? i am not sure what to call it WONDERFUL!!! it is fast easy and you run your own credit card!! which i love. you have the option of receiving a receipt or having it emailed to you which is fantastic!!

all i can say is i know i am the longest patient that childrens clinic/kids and teens probably has and i know i am the longest one to have written a review...so please read what i had to say...go through the changes they are making and you will be glad you did.

bonus is the ONSITE urgent care!! they have all your records and the ease of getting to them is wonderful!!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Kristyal S.",
    rating: 5,
    date: "2015-01-16",
    text: `I have 3 kids, 8, 4, 2 they are all under the care of Dr. De Silva and her staff. I could not be happier with the Pasadena office. My kids get sick a lot and they always get me in right away. They are helpful and very informative. They take their time when examining my children and that's very reassuring as a parent to see someone care just as much as I do.

Being that I work long hours my children are no strangers to the Pasadena urgent care. The nurses are phenomenal with my kids. they are quick to get us in and out. It's awesome because after 12 hour days that last thing I want to do is sit for hours in the urgent care :)

The Pasadena office is nothing short of excellent. Its Doctors offices like this that truly care and have the well being of our children at heart.

Thank you!!!`,
  },
  {
    locationId: "pasadena",
    reviewer: "LuzMarina M.",
    rating: 5,
    date: "2023-08-21",
    text: `Reason for visit getting a refill on my sons allergy medicine nurse Angelica is very professional friendly and attentive to all of my sons side effects needs.`,
  },
  {
    locationId: "pasadena",
    reviewer: "M L.",
    rating: 5,
    date: "2015-01-28",
    text: `My sister referred me to this office, I brought my 2 year old for a physical. The staff here is great! The nurse gave my son his shots so quick he hardly noticed and next thing I knew we were on our way home. We will definitely be back!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Maria M.",
    rating: 5,
    date: "2020-05-05",
    text: `Always great customer service and friendly doctors. We are always seen very quickly. Clean and efficient. Would recommend!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Mary G.",
    rating: 5,
    date: "2015-02-19",
    text: `Love this place been coming here since my first born in 1996 now I have 5 kids and I will keep them here toll they become adults.......all the dr.s from Jackson to dsilva are great. I 100% recommend........`,
  },
  {
    locationId: "pasadena",
    reviewer: "Megan C.",
    rating: 5,
    date: "2019-03-21",
    text: `Dr Rodriguez, Dr Bass & Dr Ayala are highly recommended to be your child's pediatrician! Every concern, every question every worry is taken care of immediately. Weather you walk in or call. I've been taking my son here since he was born and I refuse to take him anywhere else.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Mercy S.",
    rating: 5,
    date: "2024-09-05",
    text: `As usual the ladies in the front desk are very welcoming and friendly to all. Adriana is always making sure that we are checked in and assisting me with any questions regarding the process with filling out the forms. My daughter's vitals are taken right away, then we are placed in a room where is clean and comfortable. We never wait for more than 5-7 minutes from our appointment time which is a big plus. Erika Lee, the Nurse Practitioner is amazing at understanding my daughter's needs and is very encouraging. She never rushes us out and is a great listener to my daughter's needs.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Micaela R.",
    rating: 5,
    date: "2022-07-20",
    text: `I highly recommend this Pediatrics they always are able to set up same day appointments and best part is they have the urgent care for after hours.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Mike B.",
    rating: 5,
    date: "2024-04-08",
    text: `Good location. Caring staff. Good response time. Answers questions promptly. Offers flexible walk ins.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Miranda J.",
    rating: 5,
    date: "2019-07-12",
    text: `Amazing experience, the staff was very friendly and helpful. There was hardly any wait time, and the doctor was great.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Mishelle A.",
    rating: 5,
    date: "2015-03-16",
    text: `I've been coming here since my son was born. He's now 9 months and it's been great experience. I love that it's open 7 days a week and if I need to bring him the same day because he's not feeling well they'll take him on without a problem. The staff is helpful and the doctors are great!! I would definitely recommend it`,
  },
  {
    locationId: "pasadena",
    reviewer: "Nancy P.",
    rating: 5,
    date: "2016-01-25",
    text: `My three kids have been patients of Dr.De Silva for 10 years! I am speechless of how an amazing job she does , and she's an exceptional and dedicated doctor , always there for my kids . She always gives us the best care. I'm so grateful for her because she's a lifesaver my kids have asthma and she's always found a solution for them. She has an amazing staff including herself , Dr. Hilma Benjamin, and Dr. Benjamin Azaran. They have gave us amazing and dedicated care for 10 years. It's the best attention and care my kids and I have ever received! There are no better doctors than them three. I appreciate them from the bottom of my heart for taking care of alisson,Elmer and Kevin. There's no way to repay their hard work all I can say thank you! I love you guys! Exceptional Job- Peña Family`,
  },
  {
    locationId: "pasadena",
    reviewer: "Nikki E.",
    rating: 5,
    date: "2018-08-31",
    text: `I have been coming here since my first son, landin who is now 5 years old. All 3 kids come here and I've been very happy with their service. When I moved, I still made the drive to their Pasadena office bc i couldn't imagine any other nurse like Angelina helping my kids. She understood my needs, helped me during some rough days when they were sick, and my kids love her! Unfortunately she's been transferred and I was a bit skeptical of staying but I honestly feel like they've taken good care of all 3 of my kids so I wanted to give it a try with the new nurse, Reyes. When I heard she was trained by Angelina, it put me at ease. She's wonderful and friendly and I feel comfortable with her helping us. It's not easy with three kids but having a pediatric place to go and know your kids will be taken care of is extremely important. Thank you to the doctors, the staff, Reyes and especially our beloved Angelina!! You guys are awesome`,
  },
  {
    locationId: "pasadena",
    reviewer: "Olga L.",
    rating: 5,
    date: "2015-02-21",
    text: `After 2 different pediatricians and my child is only 7 months, I am content with this clinic. After my insurance sent me here I was planning to relocate eventually. My daughter has had several minor medical issues which have been well taken care and professionally handled. I personally like the tablets to fill out paperwork. The doctor comes in right away ( I've waited 30min to be seen other clinics). MOST IMPORTANTLY I LOVE THE HOURS...when home remedies don't work I rush her in to their urgent care hours instead of the E.R. and usually seen within 5-10min.
Plus my daughter likes the fish tank :)`,
  },
  {
    locationId: "pasadena",
    reviewer: "Samuel A.",
    rating: 5,
    date: "2015-03-23",
    text: `It is not often I can say I enjoy going to a doctor's office. However the staff is extremely helpful and professional. I am always happy to bring my son here.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Sandra R.",
    rating: 5,
    date: "2015-02-12",
    text: `I have taken my 14 year old daughter for the past 12 month for different reasons. I am very please with the services provided by Dr. De Silva, Nurse Angelina and the front staff. I am a nurse my self and feel that I can count on Kids and Teens Medical Group in Pasadena when my daughter is ill. I am happy about the same day appointments, and after hours urgent care. I feel like they are interested and caring for my daughters health and well being. Over all I feel they provide excellent care to patients.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Shireen K.",
    rating: 5,
    date: "2022-08-26",
    text: `Dr. Rodriguez is amazing!!!! She is so dedicated and when you need something the doctor has been known to come in on her day off to write a script, but better yet is Valeria her assistant/medical assistant!!!! What a gem! Valeria is helpful and kind and is amazing at following through on her promises of completion. The answering service could use a little work.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Susan A.",
    rating: 5,
    date: "2024-08-09",
    text: `Dr Ericka Lee in Pasadena office is absolutely the best doctor ever. She is very passionate, compassionate, professional, has lots of knowledge when it comes to kids with autism. She is caring and answers all questions.
I wouldn't ask for more.
Nurses Evet and Adriana are absolutely fantastic
Big thanks to medical director Dr De Silva for making sure our kids are in safe hands with the best medical professionals`,
  },
  {
    locationId: "pasadena",
    reviewer: "Vanessa C.",
    rating: 5,
    date: "2015-02-12",
    text: `My first experience here was wonderful, the second was even better. From the front desk to the physician. My son loves the nurses, the environment, his doctor is always making us feel comfortable and at ease with whatever we come in for from scratches to immunization shots. Also, my experience with urgent care was much better than I've experienced anywhere else. Very fast and easy. In and out.`,
  },
  {
    locationId: "pasadena",
    reviewer: "Vanessa E.",
    rating: 5,
    date: "2015-08-26",
    text: `I love coming here from the very beginning they were so nice it's great that they're also open after hours for urgent care the nurses are so nice and helpful my son is yet to cry at his check ups haha`,
  },
  {
    locationId: "pasadena",
    reviewer: "Vero L.",
    rating: 5,
    date: "2014-05-09",
    text: `The reception area is clean and they have a fish tank, books and puzzles for the children. The staff is friendly and helped me with my insurance issues since many local offices did not accept my HMO plan... The doctor was very assuring and gentle with my toddler and I was explained about my sons issue in depth with no rush, I will be transferring all my kids to this office! Thank you kids and teens!!`,
  },
  {
    locationId: "pasadena",
    reviewer: "Yesenia L.",
    rating: 5,
    date: "2015-01-19",
    text: `We have utilized kids and teens urgent care many of times for our 14 month old. They've always provided great service for after hours care. We've had to take him to urgent care due to the common colds,fevers,blocked tear ducts, cradle cap etc... The doctors and NP's have been good with giving a diagnoses and treatment. The rooms are always sanitary and properly equipped and wait time is never an issue for it being an urgent care. There really good about on-call dr calls if you don't make it to urgent care you can count on recommendations from a dr on the phone. Always pleased with nurses and staff. Dr.DeSilva is a very knowledgable MD and im glad we found such a great pediatrician and location for our child. We recommend to friends and family to take there children to this urgent care if there's no immediate need for ER because it's a much more pleasant visit with a young child than a hectic busy ER.`,
  },
  {
    locationId: "pasadena",
    reviewer: "meagan l.",
    rating: 5,
    date: "2015-02-11",
    text: `After reading reviews I was super skeptical but made the trip here anyway to at least try it out.... I am so glad I did.... I have never received better care .... I walk in three kids in tow ... Overwhelmed to say the least but the front desk staff was patient, kind and helpful.... I was left to fill out mounds of paperwork as it was our first visit for all three kids here.... The paperwork was to be expected... The nurse came and asked for permission to start the kids to allow a speedier visit and allow me a break from trying to control my attempt at organized chaos lol .... We are escorted into a room with a very short waiti time where dr de silva thoroughly examines my precious babies and makes sure I am satisfied and offers me to ask as many questions as I need ..... I have never felt so secure in a decision as I am in selecting this center to manage the health and preventive care of my most precious beings :) my heart is overflowing with gratitude for dr de silva and the staff here!!!!`,
  },
  {
    locationId: "pico-rivera",
    reviewer: "Ally ..",
    rating: 5,
    date: "2024-09-12",
    text: `I love that I was able to be seen by a different doctors office as sometimes our doctor gets extremely busy, like today I took my daughter in to be seen for the flu and Dr.Ungs was able to see her right away no wait time. I like that I was able to schedule an appointment ahead of time. it make it convenient for me as the pediatrician I had before wouldn't take walk ins and was over overbooked which would cause me to go to the ER previous years. the system they gave going I love! plus the doctor was so kind to my daughter, and so was the nurse guy. thank you!`,
  },
  {
    locationId: "pico-rivera",
    reviewer: "Emily R.",
    rating: 5,
    date: "2023-06-28",
    text: `I was in yesterday to see Dr Man and let me tell you what a wonderful experience this was. As a first time parent I had a million questions, Rosie was very sweet and the office manager Halley was also very helpful & explained everything in regards to insurance and future appointments.

I will definitely continue my child's care with them and would recommend to family and friends.`,
  },
  {
    locationId: "pico-rivera",
    reviewer: "Maritza A.",
    rating: 5,
    date: "2024-08-28",
    text: `I love bringing my kids here. Doctor Carolina Ungs is the sweetest and greatest doctor ever, she makes every visit smooth for my kids and very informative for my husband and I. The front office staff is also very helpful, friendly and they always work around my schedule for give ass appointments. Thank you Doctor Ungs and team.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Alicia J.",
    rating: 5,
    date: "2018-03-21",
    text: `I love this place Dr.vargas is really good. He also has a great team special thanks to Desire M.A for making my son feel comfortable as best she can THANK YOU..`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Andrea F.",
    rating: 5,
    date: "2024-08-16",
    text: `We always get Treated very well. Front office is great and Dr. Jose Vargas does a great job with my daughter.Hes very helpful and checks everything very professionally. He knows what he's doing. Asks alot of questions and covers everything. I do recommend this clinic. Fast great service.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Aydeh R.",
    rating: 5,
    date: "2024-09-30",
    text: `I've been bringing my son here for years and I love how convenient and caring the team is. I can easily make appointments online and appointments are always available that fit my schedule. Dr Vargas and staff are amazing. I wouldn't take my son anywhere else.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Edna C.",
    rating: 5,
    date: "2023-08-15",
    text: `Ive brought all four of my boys here for pediatricians. Our doctors name is Dr. Juarez and let me tell you she is amazing. She has seen my baby's since they were born and off the bat she remembers everything and is so thorough. My kids love her , we love her . This is a doctor that will go the extra mile just to make sure her patients are receiving the utter most experience. It's not everyday you meet someone you can trust , especially with your children's lives. I would definitely recommend going here not only are the doctors amazing but the staff has got to be some of the most attentive nurses I've had the pleasure of meeting. They are kind respectful helpful and very patient . I hope to keep coming here as my children grow`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Jocelyn P.",
    rating: 5,
    date: "2022-06-15",
    text: `I've been coming to kids and teens for over 10 years when they had their office in Van nuys! I loved how fast service was and how attentive the staff was. Now I have a 2 year old and I found kids and teens in San Fernando. Great staff and wonderful doctor!`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Jovita R.",
    rating: 5,
    date: "2024-08-15",
    text: `Great care here. I've been taking all my kids since March 1997 to both locations with
Dr Behroozan including myself.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Julian Q.",
    rating: 5,
    date: "2020-10-27",
    text: `This place is great my wife and I have been bringing our kids since they're birth. We love it here. All the Drs. Are great. This place is now in the city of San Fernando.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Karina C.",
    rating: 5,
    date: "2024-10-03",
    text: `Staff is amazing at the San Fernando location! Dr. Laurie Morales is great. She goes through everything very well and makes our visit so comforting! Absolutely love Kids and Teens ,we have been members since my kids were born with Dr Janesri Dasilva she is the best ! Thank you for a great visit once again ! Receptionists very nice and professional`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Karla C.",
    rating: 5,
    date: "2018-03-15",
    text: `Dr. Vargas has seen my son twice now and I really like how he treats him as a patient, very nice and professional. The receptionist are always friendly and very welcoming! Specially Desire she is also very friendly with my son and I really appreciate that specially in my case due to my son having autism. Waiting time is not bad which is GREAT!Overall in my personal experience I have NEVER had any problems in this facility or with any employees!! I will continue to come here and refer my friends and family!!`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Kayla B.",
    rating: 5,
    date: "2018-12-14",
    text: `I had an appointment day and it was great as always. Susan and Angelina are always friendly and very helpful. I love coming here when they are here!!!!`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Kimberley C.",
    rating: 5,
    date: "2024-11-20",
    text: `This was our first time at this Doctor's office. My daughter was scheduled for physical.
The nurse was lovely and the doctor was thorough and kind.
Front desk was helpful and nice.
Overall great experience.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Lorne W.",
    rating: 5,
    date: "2023-08-22",
    text: `My children have been seeing Dr. Kim for a few months. She is very responsive. The kids are not afraid to see her. They can speak to her about their bodies and she takes them seriously.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Monica C.",
    rating: 5,
    date: "2024-08-26",
    text: `We've been taking our son to Dr Vargas for over 3 years now and we have no complaints. Staff is friendly & helpful. Facility is always clean.`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Ruby U.",
    rating: 5,
    date: "2018-04-09",
    text: `Desire, M.A thanks for your great service, you always make us feel like home!`,
  },
  {
    locationId: "san-fernando",
    reviewer: "Stephanie O.",
    rating: 5,
    date: "2019-01-31",
    text: `We have been going to the Van Nuys location for years, that is until we found out there was an office in Pacoima. All the staff is very friendly. Front office staff Susan and Angelina are very nice and helpful. They both answered all my questions and helped fill out my daughter physical forms for school with no problem. We have had the opportunity to visit this location a few times now and I must say it is very accommodating to our needs and schedules. I would highly recommend this location for your kids.`,
  },
  {
    locationId: "torrance",
    reviewer: "Andrew W.",
    rating: 5,
    date: "2022-08-15",
    text: `Great staff and doctors. Very accommodating. Helped us through the newborn months answering all of our questions. Really appreciate being able to ask questions over text.`,
  },
  {
    locationId: "torrance",
    reviewer: "Giselle G.",
    rating: 5,
    date: "2024-10-01",
    text: `I've been searching for a great pediatrician since I've had kids. I can confidently say this office and the drs/workers are my favorite. They're so professional and so kind. I didn't have to wait that long. It was clean and not cluttered and they really show they care. I absolute loved it and made me feel so good that my kids are being taken care of by good people. So thank you`,
  },
  {
    locationId: "torrance",
    reviewer: "Pallavi M.",
    rating: 5,
    date: "2024-09-10",
    text: `Easy to get an appointment which is at most important.
less wait time, and needs are taken care off in a very professional manner.
I highly recommend the place`,
  },
  {
    locationId: "valencia",
    reviewer: "Christine B.",
    rating: 5,
    date: "2024-12-06",
    text: `I go to the kids and teens office on Soledad in canyon country. Dr Nat is amazing, knowledgeable, patient and kind. She truly cares about her patients. Her staff also goes above and beyond. Bania goes out of her way to make sure referrals and appointments are in order. Both of them have held my hand and walked me through the process as we navigate my son's health issues. They truly care and I am forever grateful. I cannot recommend this office enough!`,
  },
  {
    locationId: "valencia",
    reviewer: "Cindy L.",
    rating: 5,
    date: "2025-05-27",
    text: `I was looking for a good pediatrician around me, since the one we had never have an available appointment if we need to check on her. Im glad i found Kids and Teens clinic Dr Palak Shelat is amazing, very kind, professional and knowledgeable. The clinic is very clean and nice, front desk is very friendly. They also have an available same day appointment. Thank you Kids and teens medical group.`,
  },
  {
    locationId: "valencia",
    reviewer: "Gigi G.",
    rating: 5,
    date: "2023-04-20",
    text: `Dr. Altman, Dawn and Staff always get me right in when concerned about my kids. They have been with my kids since they were babies! Wonderful, Caring, and even call to see how my kids are doing when they are sick. I appreciate ya'll so much!`,
  },
  {
    locationId: "valencia",
    reviewer: "Karmilia A.",
    rating: 5,
    date: "2026-06-22",
    text: `I love this doctor's office. They've been so good to both me and my son. And i especially love that it offers alternative options to parents who prefer to not vaccinate or who want to delay vaccines.

Dr. Altman is remarkable. She is so warm and gracious, and she has been incredibly helpful whenever I've had questions during my son's visits especially for his check ups. My son is very smiley with her, so I take that as a great sign. A lot of doctors can come across as very sour or overly serious with kids, so I really appreciate how kind and approachable she is.

The ladies at the front are also incredibly warm. They take good care of us, and if there are ever any issues with my insurance, they handle it right away. They also always offer us formula to take home, which has been such a huge help for me.

The office itself is very clean and kid-friendly, especially the waiting areas. It doesn't have that awful doctor's office smell or harsh neon colors that would spook any child. I really appreciate that they've made the office feel comfortable for both parents and children.

The wait times have been pretty long for me, but I usually plan my day around doctor visits, so I expect to be there for a while. That may not be ideal for every parent, but I'm fortunate enough not to usually be in a rush.

Ifeel very fortunate if not blessed to have found this place.`,
  },
  {
    locationId: "valencia",
    reviewer: "Karmilia A.",
    rating: 5,
    date: "2026-09-17",
    text: `Yet another excellent appointment today. I'm so grateful for the care from the staff and doctors. They have always treated me so well and answer ant questions i have whenever i come in for my son's pediatric appointments. Yajaira was absolutely wonderful. She made sure to pass along any questions i had for the doctor before she saw is and even sent us home with a good number of cans of formula! Truly happy with the service`,
  },
  {
    locationId: "valencia",
    reviewer: "Lisa W.",
    rating: 5,
    date: "2023-01-09",
    text: `My son has been a patient of Dr Adrienne Altman since birth. She is so caring and visiting her office is just that...a visit. She has cared for him through concerning health issues to making sure he is up to date with his immunizations. My daughter was also a patient of Dr Altmans since she was an infant and she is now 24 and seeing a general doctor. The years she was with Dr Altman were just as special and now my daughter will take her brother in for care when I'm not available. I highly recommend this clinic. It is easy to schedule an appointment and the hours are convenient. The office is very clean, centrally located, there is plentiful parking, and the staff is friendly. If you are in need of a family friendly pediatric office look no further. You will have exceptional care hands down!`,
  },
  {
    locationId: "valencia",
    reviewer: "Lusine M.",
    rating: 5,
    date: "2023-05-02",
    text: `You can make the same day appointment with very nice doctors. They are very educated and care about kids. Front desk staff are very friendly , professional, and helpful. I Strongly recommend this place .`,
  },
  {
    locationId: "valencia",
    reviewer: "Mag V.",
    rating: 5,
    date: "2024-10-23",
    text: `At Kids & Teens Medical Group - Valencia, they go above and beyond their duties to help you. Dawn, who is under Dr Altman is completely amazing. Her client service is outstanding, she makes sure everything gets done and if you dont know how, she is there right behind you to help. I appreciate her and Kids & Teens Medical Group - Valencia very much. Highly recommend.`,
  },
  {
    locationId: "valencia",
    reviewer: "Marine G.",
    rating: 5,
    date: "2023-04-25",
    text: `Great experience! Made a same day appointment on and got in right away. The front desk staff and the medical assistant were very nice and helpful. Dr. was great, gave realistic expectations and timelines. I defenetly recommend this pediatric clinic to all parents`,
  },
  {
    locationId: "valencia",
    reviewer: "Rosie Y.",
    rating: 5,
    date: "2024-08-30",
    text: `Great service and care. Highly recommend. They treated my kids very kindly.

Staff had oral hygiene kits as a free giveaway to kids. Very clean location.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Adva Odele A.",
    rating: 5,
    date: "2021-06-29",
    text: `We are with this medical group for 3 years!!
We are very happy, they are super organized and professional especially Dr Victoria Millet,
She is such a great kindness person, professional pediatrician, she really care about the kids , even if its after business hours .
I visit at Van Nays location , and sometimes Northridge and the crew also are very nice and polite !

Thank you guys for the great service!
I really have a feeling that we are in a good hands!!`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Andrea E.",
    rating: 5,
    date: "2024-09-05",
    text: `We have had all great experiences! We love the doctors and staff. Always helpful when I need documents completed.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Cindy C.",
    rating: 5,
    date: "2012-07-18",
    text: `I cindy Campos was very satisfied of the service that was given to child, The receptionist was polite, the nurse was excellent and the doctor was really nice.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Cindy C.",
    rating: 5,
    date: "2013-02-01",
    text: `I been in this office multiple times and its been great, the nurses are excellent and the doctor are excellent to very happy with this office.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Cindy C.",
    rating: 5,
    date: "2014-05-14",
    text: `I love the van nuys office the employees are excellent and pleasant.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Gabby I.",
    rating: 5,
    date: "2014-11-03",
    text: `I have been bringing my son to these offices since birth, it's almost 6 years. I've visited all locations. I now have a 5 month old baby that I've also been bringing to kids & teens. I love the care they provide and the wait is not long. In this particular office I like nurse Valerie. The doctors are all great and organized.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Junior L.",
    rating: 5,
    date: "2019-01-30",
    text: `The K&T ladies are the best, they will help you ASAP with your scheduled time or if you are new, they will immediately attend you and help you in any way, They are soo Nice and Amazing. This Doctors office in Van Nuys is the best and better than the other offices I've gone to. You will never doubt anything they assist you or the other clients. They have all the attention towards you if it's an emergency or some kind of check up. Please, Go to them, they will do anything and everything for you to feel better in every stage as in physically. Thank You soo much for your patience and consideration for myself and others whom I've recommended to come to this Doctors office. I Thank all nurses at this area and I appreciate a lot they've done for others and myself.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Lea Z.",
    rating: 5,
    date: "2014-05-15",
    text: `Brought my baby here since birth. Love Dr. Meena she is sweet takes her time and is so helpful. My baby had trouble with his formula so we were literally here every week but every week everyone was so helpful. The nurses are great Jasmine & Valerie they truly care about your child and you aren't rush. :)`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Lea Z.",
    rating: 5,
    date: "2026-09-05",
    text: `This was my first time bringing both of my teenagers to kids and teens, and we had a great experience. Oscar Escobar was very professional, thorough, and patient, and answered all of my questions. Maria was also very helpful and guided me through applying for temporary Medi-Cal for their sports physicals and explained how to continue with the full application. The whole process was easy and stress-free. Highly recommend!`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Linda R.",
    rating: 5,
    date: "2012-12-14",
    text: `I must say this is the best clinic in the valley . The doctors & nurses are very friendly and take their time with our children. I highly recommend this clinic!.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Lorena C.",
    rating: 5,
    date: "2018-02-27",
    text: `The staff is great... Dr. Ayala is the best.. He takes his time to explain things in detail.. yeah the waiting time might be long at times, but it's worth the wait... the only thing I don't agree on is the $10 fee for lab work. Never have I been to a place where they charge you for blood work.. they send you to the lab instead.. Other than that, I can't complain..`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Maria T.",
    rating: 5,
    date: "2014-05-15",
    text: `Great Environment. The staff is very friendly and doctors are caring not rushing you like other places. You hardly go to clinics that the staff like Valerie love that love there job. Some ppl are in it for the money but this clinic is there to help. Thanks for the experience. .`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Mayra A.",
    rating: 5,
    date: "2024-02-29",
    text: `I em very happy i found this clinic is close to my home and the doctors and nurses they are all nice and i always get all my questions answered.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Mercedes D.",
    rating: 5,
    date: "2018-05-01",
    text: `I love this office!Both my boys have been with this office from birth the staff have always been so helpful. From the front desk staff who always has a smile on there face and always remember my kids to the amazing Dr. Ayala who has always listen to everything I have to say and has made both of my boys very comfortable. Dr. Alyala always has a smile on his face and will always make you and your kids smile. Thank you all for everything you do and continue to do.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Michell M.",
    rating: 5,
    date: "2019-01-16",
    text: `I have been at this Practice for 8-9 years. But at the Mission Hills location. I have 4 children. Our visits at most part are always long and not to satisfying . Early this morning I called and made my daughter a appointment and it was given to me after 2pm. As I'm driving to the office I thought to my self ; omg it's just another virus , that's what I expected to be told . So my daughter was scheduled with a different doctor that I have never heard of. After leaving this office I was SATISFIED not just with the front office but what caught my attention was the doctor. He took his time . Asked me questions. Interact with my daughter. Went over different options .
This location will now be where I will be going. I wish I have known of this location before.
Shout outs to Dr. Orlando Ayala.
He is why I am giving this place a 5
Thank you Me. Orlando for you're time.I hope all parents have felt this way.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Monique D.",
    rating: 5,
    date: "2018-12-08",
    text: `I used to go to the Mission Hills location (till it closed) now me children attend the Van Nuys location. The receptionists/ MAs are always friendly. I love seeing Hilma Benjamin MD and Cze-Ja PNP I love the fact that they always remember my children. Its very personal and like family with them, Not just another "check off the list" like with other Doctors. I highly recommend them to my friends and family`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Olga O.",
    rating: 5,
    date: "2024-03-04",
    text: `Great service, and fast service definitely recommend it ,been coming here for years and wouldnt change to a different clinic`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Tifany J.",
    rating: 5,
    date: "2015-01-23",
    text: `I love kids and teens. I feel secure knowing I can trust the drs with my children. The receptionist is the greatest! She is so welcoming! Great way to start each visit.`,
  },
  {
    locationId: "van-nuys",
    reviewer: "Wendy H.",
    rating: 5,
    date: "2024-09-12",
    text: `Siempre me atienden bien El doctor Tylor y sus Asistentes son muy amables, me gusta el servicio que me brindan y la paciensia que le tienen a mi hijo..`,
  },
  {
    locationId: "west-hills",
    reviewer: "C R.",
    rating: 5,
    date: "2021-07-09",
    text: `My review is specifically in regards to the customer service I received from Ms Burke of the medical group billing department. She is absolutely so wonderful and quick to provide clarification and resolution. Very professional and knowledgeable, attentive to concerns and prompt in action. Such an asset to the medical group!!!!`,
  },
  {
    locationId: "west-hills",
    reviewer: "Carly D.",
    rating: 5,
    date: "2020-02-28",
    text: `I took my 2 year old here because my Encino office is closed on Wednesdays. I got in the same day and didn't wait at all to be seen. The office has an amazing fish tank that had my kid HYPNOTIZED. Once we got in a room, I noticed all the walls were hand-painted! It was amazing. The doctor was extremely receptive and respectful. We concluded that my son was allergic to the antibiotic the ER doctor prescribed him and we also found he had a double ear infection (ER doctor must've missed that). He wrote me a new prescription for him and everything went smoothly! I wish i lived closer so I could take him here for every visit.`,
  },
  {
    locationId: "west-hills",
    reviewer: "Heather G.",
    rating: 5,
    date: "2019-09-19",
    text: `My son has been going to this location since he was 3 ( when it was Pediatric Affiliates.) When Dr. Baik left , we stayed with the practice and though all of the doctors are wonderful, Grace Dasovich, MD is beyond awesome. My almost 16 year old hates physicals and is not a fan of doctors, but she was AMAZING! We were in and out within 30 minutes.`,
  },
  {
    locationId: "west-hills",
    reviewer: "Jasmine R.",
    rating: 5,
    date: "2019-08-16",
    text: `I'm so happy I found this place they treated my daughter so well they don't rush and they really listen to what you say .`,
  },
  {
    locationId: "west-hills",
    reviewer: "Marta R.",
    rating: 5,
    date: "2025-06-09",
    text: `I definitely recommend this office over the northridge one. I've brought my daughter here with Dr Mark Snyder and he's an amazing physician that listens carefully to any concerns you may have and shows the care for his patients.`,
  },
  {
    locationId: "west-hills",
    reviewer: "Merari Q.",
    rating: 5,
    date: "2024-05-04",
    text: `Love this Dr. office!!! Nice, informative, helpful, and kind My 3 yr old son loves coming to the Drs now. Big difference from previous Drs office glad we made the change. Definitely recommend their services P.s. like the wall art`,
  },
  {
    locationId: "west-hills",
    reviewer: "Mila S.",
    rating: 5,
    date: "2018-07-20",
    text: `Great team of doctors, very pleasant staff and very convenient. Thank you all for everything.`,
  },
  {
    locationId: "west-hills",
    reviewer: "Parham N.",
    rating: 5,
    date: "2018-12-21",
    text: `My cousin came here after finding it on Yelp and found the office to be very clean and accommodating the front staff was actually very friendly we have had interesting experiences with front steps in the past where they can be standoffish but in this case they were very happy to see us and wanted to make sure my cousin was OK

Cousin has been dealing with a sore throat for months and they were able to provide the right medication and give thorough care.

I would recommend this office.`,
  },
  {
    locationId: "west-hills",
    reviewer: "Stacey O.",
    rating: 5,
    date: "2024-02-28",
    text: `Wonderful care for my daughter from this office and they are always so sweet and kind to us. My daughter says she has fun at the doctors office thanks to everyone here!`,
  },
  {
    locationId: "west-hills",
    reviewer: "Sujith K.",
    rating: 5,
    date: "2024-02-28",
    text: `Excellent service. Dr Mark Snyder is the best. Very good doctor who shares all the details and gives you a clear picture on the treatment that is done to my kids. Staff are kind, nice excellent people.`,
  },
  {
    locationId: "west-hills",
    reviewer: "Tameka C.",
    rating: 5,
    date: "2024-09-23",
    text: `Kids &Teens Medical Group -West Hills
Has been a great medical experience for my daughter. Front desk personal was kind and ontime. The experience with the Primary Care Doctor is efficiently great .
They show Care as well as explaining the dos' and donts'. We five this office with the staff 5 stars!!!

Tameka & Kadeana`,
  },
  {
    locationId: "west-hills",
    reviewer: "Taylour S.",
    rating: 5,
    date: "2024-02-29",
    text: `I've been taking my daughter here for a while now and she loves everyone here, super friendly and helpful!`,
  },
  {
    locationId: "whittier",
    reviewer: "Elizabeth S.",
    rating: 5,
    date: "2024-09-10",
    text: `Very sweet and caring staff ! Same day appointments available and great quality . My son needed a physical to start a new school and we were able to get it done same day .`,
  },
  {
    locationId: "whittier",
    reviewer: "Tania R.",
    rating: 5,
    date: "2023-04-19",
    text: `This is definitely an overdue review! I am really happy that I was able to find Dr. Gutierrez. I absolutely love the staff too they are always very kind. Nowadays it is very difficult to find good pediatricians that listen to you and answer all your questions. Dr. Gutierrez had gone over and beyond to provide the best care for my children who by the way are always sick. He is very caring, knowledgeable and treats my children with kindness and respect.

The office is also always very clean. The receptionist who I am forgetting her name at the moment is also very sweet. This is an office that you are all most guaranteed to be able to get an appointment the day of or the next. I highly recommend Dr. Gutierrez, you and your children will love Dr. Gutierrez!`,
  },
  {
    locationId: "whittier",
    reviewer: "Vanessa M.",
    rating: 5,
    date: "2023-09-14",
    text: `I brought my son to this doctors office , very clean and the staff was very sweet. Thankful I found a good doctor for my child.`,
  },
  {
    locationId: "whittier",
    reviewer: "Victoria A.",
    rating: 5,
    date: "2024-08-21",
    text: `My daughters visit today went very well. She was seen promptly treated kindly and in a professional manner. We left feeling like she was genuinely cared for as an individual and not just a number. Thank you very much! Keep up the good work!`,
  },
];

/** All 5-star reviews for one clinic, in the order they appear above. */
export function reviewsForLocation(locationId: string): YelpReview[] {
  return yelpReviews.filter((review) => review.locationId === locationId);
}

/** Every locationId that has at least one Yelp review. */
export function locationIdsWithReviews(): string[] {
  return [...new Set(yelpReviews.map((review) => review.locationId))];
}

export type GroupedYelpReview = {
  reviewer: string;
  entries: { rating: number; date: string; text: string }[];
};

/**
 * Folds a reviewer's multiple reviews (e.g. Karmilia A.'s two Valencia
 * reviews) into a single stacked entry, oldest first, per the client's
 * request to group repeat reviewers "chronologically, stacked on top of
 * each other". Reviewers are ordered by their most recent review, newest
 * first, so an active reviewer's latest praise surfaces near the top.
 */
export function groupReviewsByReviewer(reviews: YelpReview[]): GroupedYelpReview[] {
  const byReviewer = new Map<string, GroupedYelpReview>();
  for (const review of reviews) {
    const existing = byReviewer.get(review.reviewer);
    const entry = { rating: review.rating, date: review.date, text: review.text };
    if (existing) {
      existing.entries.push(entry);
    } else {
      byReviewer.set(review.reviewer, { reviewer: review.reviewer, entries: [entry] });
    }
  }
  const grouped = [...byReviewer.values()];
  for (const group of grouped) {
    group.entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }
  grouped.sort((a, b) => {
    const aLatest = a.entries[a.entries.length - 1].date;
    const bLatest = b.entries[b.entries.length - 1].date;
    return aLatest < bLatest ? 1 : aLatest > bLatest ? -1 : 0;
  });
  return grouped;
}

// The single review featured on the Homepage and Media page, per the
// client's original request. Karmilia A.'s most recent Valencia review was
// named specifically by both the client and the reviewing stakeholder.
const featured = yelpReviews.find(
  (review) =>
    review.locationId === "valencia" &&
    review.reviewer === "Karmilia A." &&
    review.date === "2026-09-17"
);

if (!featured) {
  throw new Error(
    "Featured Yelp review (Karmilia A., Valencia, 2026-09-17) is missing from yelpReviews — " +
      "the Homepage and Media page both depend on it."
  );
}

export const featuredYelpReview: YelpReview = featured;
