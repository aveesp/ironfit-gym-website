import { Injectable } from '@angular/core';
import { Gym, Trainer, MembershipPlan, BlogPost, FAQ } from '../models';

@Injectable({ providedIn: 'root' })
export class DataService {
  gyms: Gym[] = [
    {
      id: '1', name: 'Iron Beast Gym', slug: 'iron-beast-gym',
      description: 'Premium fitness facility with state-of-the-art equipment, expert trainers, and a motivating community. We offer everything from strength training to cardio and yoga.',
      rating: 4.8, reviewCount: 342, location: 'Downtown', city: 'New York', address: '123 Fitness Ave, Manhattan, NY 10001',
      price: 3999, priceLabel: '₹3,999/mo', featured: true,
      images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800'],
      amenities: ['Locker Rooms', 'Showers', 'Parking', 'WiFi', 'Juice Bar', 'Sauna'],
      facilities: ['Cardio Zone', 'Free Weights', 'CrossFit Box', 'Pool', 'Yoga Studio', 'Spin Room'],
      openNow: true,
      hours: [{ day: 'Mon-Fri', open: '5:00 AM', close: '11:00 PM' }, { day: 'Sat-Sun', open: '6:00 AM', close: '10:00 PM' }],
      phone: '+1 (212) 555-0101', whatsapp: '+12125550101',
      tags: ['CrossFit', 'Personal Training', 'Cardio', 'Yoga'],
      trainers: [], plans: [], lat: 40.7128, lng: -74.006
    },
    {
      id: '2', name: 'Flex Power Studio', slug: 'flex-power-studio',
      description: 'Boutique fitness studio specializing in HIIT, strength training, and functional fitness. Small group classes for maximum results.',
      rating: 4.6, reviewCount: 218, location: 'Midtown', city: 'New York', address: '456 Strength Blvd, Midtown, NY 10019',
      price: 3199, priceLabel: '₹3,199/mo', featured: true,
      images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      amenities: ['Locker Rooms', 'Showers', 'WiFi', 'Towel Service'],
      facilities: ['HIIT Studio', 'Free Weights', 'Functional Training', 'Cardio'],
      openNow: true,
      hours: [{ day: 'Mon-Fri', open: '6:00 AM', close: '10:00 PM' }, { day: 'Sat-Sun', open: '7:00 AM', close: '8:00 PM' }],
      phone: '+1 (212) 555-0202', whatsapp: '+12125550202',
      tags: ['HIIT', 'Strength', 'Functional Training'],
      trainers: [], plans: [], lat: 40.7549, lng: -73.9840
    },
    {
      id: '3', name: 'Zenith Wellness Club', slug: 'zenith-wellness-club',
      description: 'A luxury wellness destination combining fitness, spa, and mindfulness. Perfect for those seeking holistic health transformation.',
      rating: 4.9, reviewCount: 512, location: 'Upper East Side', city: 'New York', address: '789 Wellness Way, UES, NY 10028',
      price: 7499, priceLabel: '₹7,499/mo', featured: true,
      images: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800', 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'],
      amenities: ['Luxury Lockers', 'Steam Room', 'Sauna', 'Pool', 'Cafe', 'Valet Parking'],
      facilities: ['Olympic Pool', 'Yoga Studio', 'Pilates', 'Cardio', 'Weights', 'Spa'],
      openNow: false,
      hours: [{ day: 'Mon-Fri', open: '5:30 AM', close: '11:00 PM' }, { day: 'Sat-Sun', open: '7:00 AM', close: '9:00 PM' }],
      phone: '+1 (212) 555-0303', whatsapp: '+12125550303',
      tags: ['Yoga', 'Swimming', 'Luxury', 'Women Only'],
      trainers: [], plans: [], lat: 40.7736, lng: -73.9566
    },
    {
      id: '4', name: 'Urban CrossFit Box', slug: 'urban-crossfit-box',
      description: 'NYC\'s premier CrossFit affiliate. Push your limits with our certified coaches and a passionate community.',
      rating: 4.7, reviewCount: 189, location: 'Brooklyn', city: 'New York', address: '321 Box St, Brooklyn, NY 11201',
      price: 4499, priceLabel: '₹4,499/mo', featured: false,
      images: ['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800'],
      amenities: ['Locker Rooms', 'Parking', 'Gear Shop'],
      facilities: ['CrossFit Box', 'Olympic Lifting', 'Gymnastics Rings', 'Rowers', 'Assault Bikes'],
      openNow: true,
      hours: [{ day: 'Mon-Fri', open: '5:30 AM', close: '9:00 PM' }, { day: 'Sat-Sun', open: '8:00 AM', close: '6:00 PM' }],
      phone: '+1 (718) 555-0404', whatsapp: '+17185550404',
      tags: ['CrossFit', 'Olympic Lifting'],
      trainers: [], plans: [], lat: 40.6928, lng: -73.9903
    },
    {
      id: '5', name: 'Lotus Yoga & Pilates', slug: 'lotus-yoga-pilates',
      description: 'A serene sanctuary for yoga and Pilates. All levels welcome — from beginners to advanced practitioners.',
      rating: 4.5, reviewCount: 276, location: 'Tribeca', city: 'New York', address: '555 Calm St, Tribeca, NY 10013',
      price: 2799, priceLabel: '₹2,799/mo', featured: false,
      images: ['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'],
      amenities: ['Changing Rooms', 'Showers', 'Mat Rental', 'Tea Bar'],
      facilities: ['Hot Yoga', 'Vinyasa', 'Pilates Reformer', 'Meditation Room'],
      openNow: true,
      hours: [{ day: 'Mon-Fri', open: '6:00 AM', close: '9:00 PM' }, { day: 'Sat-Sun', open: '7:00 AM', close: '7:00 PM' }],
      phone: '+1 (212) 555-0505', whatsapp: '+12125550505',
      tags: ['Yoga', 'Pilates', 'Women Only'],
      trainers: [], plans: []
    },
    {
      id: '6', name: 'AquaFit Center', slug: 'aquafit-center',
      description: 'The city\'s best aquatic fitness facility. Olympic pool, swimming lessons, water aerobics, and more.',
      rating: 4.4, reviewCount: 143, location: 'Queens', city: 'New York', address: '888 Pool Rd, Queens, NY 11375',
      price: 3699, priceLabel: '₹3,699/mo', featured: false,
      images: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800', 'https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=800'],
      amenities: ['Olympic Pool', 'Locker Rooms', 'Parking', 'Cafe'],
      facilities: ['Olympic Pool', 'Warm-up Pool', 'Cardio', 'Weights', 'Water Aerobics'],
      openNow: true,
      hours: [{ day: 'Mon-Fri', open: '5:00 AM', close: '10:00 PM' }, { day: 'Sat-Sun', open: '6:00 AM', close: '9:00 PM' }],
      phone: '+1 (718) 555-0606', whatsapp: '+17185550606',
      tags: ['Swimming', 'Cardio'],
      trainers: [], plans: []
    },
  ];

  trainers: Trainer[] = [
    {
      id: '1', name: 'Marcus Johnson', slug: 'marcus-johnson',
      photo: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400',
      title: 'Elite Strength & Conditioning Coach',
      specializations: ['Strength Training', 'HIIT', 'Olympic Lifting', 'Sports Performance'],
      certifications: ['NSCA-CSCS', 'ACE CPT', 'CrossFit L3'],
      experience: 8, rating: 4.9, reviewCount: 127, clients: 200,
      bio: 'Former collegiate athlete turned elite coach with 8+ years transforming bodies and mindsets. I specialize in building functional strength and explosive power for athletes and fitness enthusiasts alike.',
      social: { instagram: '#', youtube: '#' },
      timings: ['Mon-Fri: 6AM-8PM', 'Sat: 8AM-4PM'],
      gymId: '1', gymName: 'Iron Beast Gym',
      reviews: [
        { id: 'r1', author: 'Alex P.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', rating: 5, comment: 'Marcus completely transformed my training. Lost 25 lbs and gained serious muscle!', date: '2024-03-15' },
        { id: 'r2', author: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', rating: 5, comment: 'Best trainer I\'ve ever worked with. So knowledgeable and motivating!', date: '2024-02-20' }
      ]
    },
    {
      id: '2', name: 'Sofia Martinez', slug: 'sofia-martinez',
      photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
      title: 'Yoga & Mindfulness Expert',
      specializations: ['Hatha Yoga', 'Vinyasa', 'Pilates', 'Mindfulness Meditation'],
      certifications: ['RYT-500', 'Pilates Mat Level II', 'Meditation Teacher'],
      experience: 10, rating: 4.8, reviewCount: 203, clients: 350,
      bio: 'With a decade of practice and teaching, I guide students toward holistic wellbeing through the union of movement, breath, and mindfulness. Every class is a journey inward.',
      social: { instagram: '#', facebook: '#' },
      timings: ['Mon-Sat: 7AM-7PM'],
      gymId: '5', gymName: 'Lotus Yoga & Pilates',
      reviews: [
        { id: 'r3', author: 'Emma R.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', rating: 5, comment: 'Sofia\'s classes are life-changing. My stress levels have completely dropped.', date: '2024-03-10' }
      ]
    },
    {
      id: '3', name: 'Derek Chen', slug: 'derek-chen',
      photo: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400',
      title: 'CrossFit & Functional Fitness Coach',
      specializations: ['CrossFit', 'Functional Training', 'Nutrition Coaching', 'Weight Loss'],
      certifications: ['CrossFit L2', 'Precision Nutrition L1', 'NASM CPT'],
      experience: 6, rating: 4.7, reviewCount: 98, clients: 150,
      bio: 'I believe in making fitness accessible and fun. My coaching style combines scientific principles with high-energy workouts that keep you coming back for more.',
      social: { instagram: '#', youtube: '#', facebook: '#' },
      timings: ['Mon-Fri: 5AM-7PM', 'Sat-Sun: 8AM-2PM'],
      gymId: '4', gymName: 'Urban CrossFit Box',
      reviews: []
    },
    {
      id: '4', name: 'Alicia Brooks', slug: 'alicia-brooks',
      photo: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400',
      title: 'Cardio & Weight Loss Specialist',
      specializations: ['Weight Loss', 'Cardio Training', 'Nutrition', 'HIIT'],
      certifications: ['ACSM CPT', 'Nutritionist (PN2)', 'Zumba Instructor'],
      experience: 5, rating: 4.6, reviewCount: 84, clients: 120,
      bio: 'I help women reclaim their health and confidence through sustainable, enjoyable fitness programs. No crash diets, no punishing workouts — just real, lasting results.',
      social: { instagram: '#' },
      timings: ['Mon-Fri: 7AM-6PM'],
      gymId: '2', gymName: 'Flex Power Studio',
      reviews: []
    },
    {
      id: '5', name: 'Ryan O\'Brien', slug: 'ryan-obrien',
      photo: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=400',
      title: 'Bodybuilding & Hypertrophy Coach',
      specializations: ['Bodybuilding', 'Hypertrophy', 'Contest Prep', 'Powerlifting'],
      certifications: ['IFBB Pro Card', 'NASM CPT', 'Strength & Conditioning Specialist'],
      experience: 12, rating: 4.9, reviewCount: 156, clients: 280,
      bio: '12-time national bodybuilding champion turned elite coach. I bring competition-level expertise to everyday athletes who want to build their best physique.',
      social: { instagram: '#', youtube: '#' },
      timings: ['Mon-Sat: 6AM-9PM'],
      gymId: '1', gymName: 'Iron Beast Gym',
      reviews: []
    },
    {
      id: '6', name: 'Priya Patel', slug: 'priya-patel',
      photo: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400',
      title: 'Swimming & Aquatic Fitness Coach',
      specializations: ['Swimming', 'Water Aerobics', 'Triathlon Prep', 'Stroke Correction'],
      certifications: ['USA Swimming Coach', 'WSCA Aqua Fitness', 'CPR/AED'],
      experience: 7, rating: 4.5, reviewCount: 62, clients: 90,
      bio: 'Former competitive swimmer coaching all levels, from beginners learning their first stroke to triathletes chasing podiums. Water is my playground!',
      social: { instagram: '#', facebook: '#' },
      timings: ['Mon-Fri: 6AM-7PM', 'Sat: 7AM-2PM'],
      gymId: '6', gymName: 'AquaFit Center',
      reviews: []
    },
  ];

  plans: MembershipPlan[] = [
    {
      id: '1', name: 'Day Pass', duration: '1 Day', price: 1299, features: ['Full gym access', 'Locker room', 'One group class', 'Towel service'], popular: false, color: 'border-gray-500'
    },
    {
      id: '2', name: 'Monthly', duration: '1 Month', price: 3999, originalPrice: 5999, features: ['Unlimited gym access', 'All group classes', 'Locker & towel', '1 PT session/month', 'App access', 'Nutrition guide'], popular: true, color: 'border-primary'
    },
    {
      id: '3', name: 'Quarterly', duration: '3 Months', price: 3199, originalPrice: 3999, features: ['Everything in Monthly', '3 PT sessions/month', 'Body composition analysis', 'Priority booking', 'Guest passes (2/mo)'], popular: false, color: 'border-orange-500'
    },
    {
      id: '4', name: 'Annual', duration: '12 Months', price: 2499, originalPrice: 3999, features: ['Everything in Quarterly', 'Unlimited PT consultations', 'Meal plan access', 'VIP locker', 'Spa discounts (20%)', 'Free merchandise'], popular: false, color: 'border-yellow-500'
    },
  ];

  blogs: BlogPost[] = [
    {
      id: '1', slug: 'ultimate-guide-building-muscle',
      title: 'The Ultimate Guide to Building Muscle in 2024',
      excerpt: 'Science-backed strategies to maximize muscle hypertrophy, from progressive overload to optimal protein intake.',
      content: '',
      category: 'Strength Training',
      author: 'Marcus Johnson', authorAvatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      date: '2024-03-20', readTime: 8, tags: ['Muscle', 'Strength', 'Hypertrophy']
    },
    {
      id: '2', slug: 'best-hiit-workouts-fat-loss',
      title: '10 Best HIIT Workouts for Maximum Fat Loss',
      excerpt: 'Torch calories and boost your metabolism with these highly effective high-intensity interval training routines.',
      content: '',
      category: 'Weight Loss',
      author: 'Alicia Brooks', authorAvatar: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=100',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      date: '2024-03-15', readTime: 6, tags: ['HIIT', 'Fat Loss', 'Cardio']
    },
    {
      id: '3', slug: 'yoga-benefits-mental-health',
      title: 'How Yoga Transforms Your Mental Health',
      excerpt: 'Discover the profound impact of a regular yoga practice on stress, anxiety, sleep quality, and overall wellbeing.',
      content: '',
      category: 'Wellness',
      author: 'Sofia Martinez', authorAvatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100',
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
      date: '2024-03-10', readTime: 5, tags: ['Yoga', 'Mental Health', 'Wellness']
    },
    {
      id: '4', slug: 'nutrition-guide-athletes',
      title: 'Nutrition Guide for Performance Athletes',
      excerpt: 'Fuel your training with the right macros, timing strategies, and supplements used by elite athletes worldwide.',
      content: '',
      category: 'Nutrition',
      author: 'Derek Chen', authorAvatar: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=100',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      date: '2024-03-05', readTime: 10, tags: ['Nutrition', 'Performance', 'Diet']
    },
    {
      id: '5', slug: 'crossfit-beginners-guide',
      title: 'CrossFit for Beginners: Everything You Need to Know',
      excerpt: 'Starting CrossFit can feel intimidating. Here\'s your complete roadmap to scaling, community, and crushing your first WOD.',
      content: '',
      category: 'CrossFit',
      author: 'Derek Chen', authorAvatar: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=100',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
      date: '2024-02-28', readTime: 7, tags: ['CrossFit', 'Beginners', 'WOD']
    },
    {
      id: '6', slug: 'swimming-fitness-benefits',
      title: 'Why Swimming is the Ultimate Full-Body Workout',
      excerpt: 'Low impact, high reward — explore the science behind swimming\'s unmatched benefits for strength, cardio, and recovery.',
      content: '',
      category: 'Swimming',
      author: 'Priya Patel', authorAvatar: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=100',
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
      date: '2024-02-20', readTime: 5, tags: ['Swimming', 'Cardio', 'Recovery']
    },
    {
      id: '7', slug: 'how-to-choose-best-gym',
      title: 'How to Choose the Best Gym Near You',
      excerpt: 'A complete guide for beginners — because the right gym makes all the difference to your fitness journey.',
      category: 'Guide',
      author: 'IronFit Editorial', authorAvatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=100',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      date: '2024-04-01', readTime: 7, tags: ['Guide', 'Beginners', 'Gym Selection'],
      content: `
<div class="blog-rich-content">

  <div class="blog-section">
    <h2>Why Your Gym Choice Matters</h2>
    <p>Finding the right gym is your first important step toward achieving your fitness goals. Whether you want to lose weight, build muscle, improve your strength, or simply live a healthier lifestyle — choosing a gym that fits your needs makes it <strong>easier to stay consistent.</strong></p>
    <div class="blog-tip-box">
      <span class="blog-tip-icon">📋</span>
      <span>With so many gyms available, knowing what to look for can save you time, money, and frustration.</span>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 1</span>
    <h2>Choose a Convenient Location</h2>
    <p>The best gym is often the one you can <strong>visit consistently</strong>. Look for a gym close to your home, workplace, or daily travel route.</p>
    <div class="blog-card-grid">
      <div class="blog-mini-card">
        <div class="blog-mini-label">🏠 Near Home</div>
        <p>Easy to fit into your morning or evening routine.</p>
      </div>
      <div class="blog-mini-card">
        <div class="blog-mini-label">💼 Near Work</div>
        <p>Perfect for lunchtime or after-work sessions.</p>
      </div>
      <div class="blog-mini-card">
        <div class="blog-mini-label">🚗 On Your Route</div>
        <p>No detours means no excuses.</p>
      </div>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 2</span>
    <h2>Check the Equipment</h2>
    <p>A good gym should have equipment that matches your preferred style of training. Before joining, take a tour and see whether it has what you need.</p>
    <p>Make a <strong>list</strong> of the equipment you'll use most and check whether the gym has it. If you're unsure, ask a staff member to walk you through what's available.</p>
    <div class="blog-tip-box">
      <span class="blog-tip-icon">📋</span>
      <span>Don't forget to check whether equipment is in good working condition during your visit.</span>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 3</span>
    <h2>Consider the Gym Environment</h2>
    <p><strong>Visit the gym before joining.</strong> Spend 15–20 minutes observing the atmosphere at the time of day you'd normally work out.</p>
    <div class="blog-two-col" style="margin-top:24px;">
      <div class="blog-env-card">
        <h3>🤫 Quiet &amp; Focused</h3>
        <p>Some people prefer a calm, low-key atmosphere where they can concentrate fully without distractions.</p>
      </div>
      <div class="blog-env-card">
        <h3>⚡ Social &amp; Energetic</h3>
        <p>Others thrive in a lively environment where they can meet fellow fitness enthusiasts and feed off the group energy.</p>
      </div>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 4</span>
    <h2>Look at Cleanliness &amp; Maintenance</h2>
    <p>A clean, well-maintained gym is essential for a positive workout experience. These small details make a significant difference.</p>
    <div class="blog-icon-grid">
      <div class="blog-icon-feature"><div class="blog-circle">🧽</div><p>Equipment Cleaned Regularly</p></div>
      <div class="blog-icon-feature"><div class="blog-circle">🚿</div><p>Hygienic Showers &amp; Changing Rooms</p></div>
      <div class="blog-icon-feature"><div class="blog-circle">🛠️</div><p>Equipment in Good Condition</p></div>
      <div class="blog-icon-feature"><div class="blog-circle">💨</div><p>Adequate Ventilation</p></div>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 5</span>
    <h2>Compare Membership Plans</h2>
    <p>Don't just look at the price — understand what you're signing up for.</p>
    <div class="blog-plan-list">
      <div class="blog-plan-item"><span class="blog-arrow">↑</span><div><strong>Monthly, Quarterly &amp; Annual Plans</strong><p>Annual plans often offer better value if you're committed.</p></div></div>
      <div class="blog-plan-item"><span class="blog-arrow">↑</span><div><strong>Personal Training Packages</strong><p>Great for beginners who want guided support.</p></div></div>
      <div class="blog-plan-item"><span class="blog-arrow">↑</span><div><strong>Group Fitness Classes</strong><p>Check whether classes are included or cost extra.</p></div></div>
      <div class="blog-plan-item"><span class="blog-arrow">↑</span><div><strong>Cancellation Policy</strong><p>Always read the fine print before signing.</p></div></div>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 6</span>
    <h2>Ask About Personal Trainers</h2>
    <p>If you're new to fitness or unsure how to use equipment, a personal trainer can be invaluable. A good trainer helps you:</p>
    <div class="blog-numbered-list">
      <div class="blog-num-item"><span class="blog-num">01</span><span>Create a personalised workout plan</span></div>
      <div class="blog-num-item"><span class="blog-num">02</span><span>Learn correct exercise form</span></div>
      <div class="blog-num-item"><span class="blog-num">03</span><span>Set realistic fitness goals</span></div>
      <div class="blog-num-item"><span class="blog-num">04</span><span>Track your progress over time</span></div>
      <div class="blog-num-item"><span class="blog-num">05</span><span>Stay accountable and motivated</span></div>
    </div>
  </div>

  <div class="blog-section">
    <span class="blog-factor-tag">Factor 7</span>
    <h2>Check the Operating Hours</h2>
    <p>Even the best gym won't help you if it's closed when you want to work out. Check that the hours fit your lifestyle.</p>
    <div class="blog-card-grid">
      <div class="blog-mini-card">
        <div class="blog-mini-label">🌅 Early Birds</div>
        <p>If you prefer morning workouts, confirm the gym opens early enough.</p>
      </div>
      <div class="blog-mini-card">
        <div class="blog-mini-label">🌙 Night Owls</div>
        <p>If you exercise after work, make sure it stays open late enough for your schedule.</p>
      </div>
      <div class="blog-mini-card" style="grid-column: 1 / -1;">
        <div class="blog-mini-label">📅 Weekends</div>
        <p>Don't forget to check weekend hours — they can differ from weekdays.</p>
      </div>
    </div>
  </div>

  <div class="blog-section">
    <h2>Final Thoughts</h2>
    <p>Choosing the right gym is not just about finding the cheapest membership. It's about finding a place where you feel <strong>comfortable, motivated, and ready to achieve your goals.</strong></p>
    <div class="blog-badge-row">
      <span class="blog-badge">📍 Location</span>
      <span class="blog-badge">🏋️ Equipment</span>
      <span class="blog-badge">🌐 Atmosphere</span>
      <span class="blog-badge">🧼 Cleanliness</span>
      <span class="blog-badge">📋 Membership</span>
      <span class="blog-badge">🕐 Hours</span>
    </div>
    <div class="blog-conclusion">
      ✅ The best gym for you is the one that fits your lifestyle and makes it easier to stay committed to your fitness journey.
    </div>
  </div>

</div>
      `
    },
  ];

  faqs: FAQ[] = [
    { question: 'How do I find a gym near me?', answer: 'Use our search bar on the home page to search by city, neighborhood, or zip code. You can also use filters to narrow by price, facilities, and more.' },
    { question: 'Can I try a gym before committing?', answer: 'Yes! Most gyms listed offer day passes or free trial periods. Look for the "Day Pass" option on the gym\'s membership page.' },
    { question: 'How do I book a personal trainer?', answer: 'Visit any trainer\'s profile page and click the "Book Consultation" button. You\'ll be connected directly with the trainer to discuss your goals and schedule.' },
    { question: 'Are there gyms for women only?', answer: 'Absolutely! Use the "Women Only" filter in our gym listings to find women-exclusive fitness spaces in your area.' },
    { question: 'What payment methods are accepted?', answer: 'Most gyms accept all major credit cards, debit cards, UPI, and digital wallets. Payment is handled directly with the gym upon enrollment.' },
    { question: 'Can I cancel my membership anytime?', answer: 'Cancellation policies vary by gym. Monthly memberships typically allow cancellation with 30-day notice. Annual plans may have different terms — always check the gym\'s policy before signing up.' },
  ];

  getGyms(): Gym[] { return this.gyms; }
  getGymById(id: string): Gym | undefined { return this.gyms.find(g => g.id === id); }
  getGymBySlug(slug: string): Gym | undefined { return this.gyms.find(g => g.slug === slug); }
  getFeaturedGyms(): Gym[] { return this.gyms.filter(g => g.featured); }

  getTrainers(): Trainer[] { return this.trainers; }
  getTrainerById(id: string): Trainer | undefined { return this.trainers.find(t => t.id === id); }
  getTrainerBySlug(slug: string): Trainer | undefined { return this.trainers.find(t => t.slug === slug); }
  getFeaturedTrainers(): Trainer[] { return this.trainers.slice(0, 4); }

  getPlans(): MembershipPlan[] { return this.plans; }

  getBlogs(): BlogPost[] { return this.blogs; }
  getBlogBySlug(slug: string): BlogPost | undefined { return this.blogs.find(b => b.slug === slug); }
  getLatestBlogs(count = 3): BlogPost[] { return this.blogs.slice(0, count); }

  getFaqs(): FAQ[] { return this.faqs; }
}
