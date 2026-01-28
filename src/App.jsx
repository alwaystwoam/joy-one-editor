import React, { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Check, Plus, ArrowLeftRight, CheckSquare, Trash2, Clock, MapPin, User, Star, HelpCircle, Plane, Compass, Train, Car, CarTaxiFront, Key } from 'lucide-react';

// ============================================================================
// SAMPLE DATA
// ============================================================================

const sampleSchedule = [
  // ===== DAY 1: Tuesday, March 18, 2025 =====
  { id: 'sch-1', name: 'Registration & Welcome Coffee', description: 'Check in, grab your badge and conference materials, and enjoy complimentary coffee', dateTime: { start: '2025-03-18T07:30:00', end: '2025-03-18T09:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Moscone Center - Hall A Lobby', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-2', name: 'Opening Keynote: The Future of Event Technology', description: 'Join CEO Sarah Chen as she unveils the latest innovations transforming how we connect and gather', dateTime: { start: '2025-03-18T09:00:00', end: '2025-03-18T10:30:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Moscone Center - Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-3', name: 'Coffee Break & Expo Hall Opens', description: 'Explore 50+ exhibitors showcasing the latest event tech solutions', dateTime: { start: '2025-03-18T10:30:00', end: '2025-03-18T11:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Expo Hall', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-4', name: 'Breakout: Sustainable Events - From Vision to Reality', description: 'Best practices for reducing environmental impact without sacrificing attendee experience', dateTime: { start: '2025-03-18T11:00:00', end: '2025-03-18T12:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 201', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-5', name: 'Breakout: Building Engaged Communities Year-Round', description: 'Strategies for maintaining attendee engagement between annual events', dateTime: { start: '2025-03-18T11:00:00', end: '2025-03-18T12:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 202', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-6', name: 'Networking Lunch', description: 'Connect with fellow attendees over a plated lunch. Themed tables available for specific interests.', dateTime: { start: '2025-03-18T12:00:00', end: '2025-03-18T13:30:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Terrace Restaurant', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-7', name: 'Panel: The Evolution of Hybrid Events', description: 'Industry leaders discuss what works, what doesn\'t, and what\'s next for hybrid experiences', dateTime: { start: '2025-03-18T13:30:00', end: '2025-03-18T14:30:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-8', name: 'Workshop: AI-Powered Event Personalization', description: 'Hands-on session: Build your first AI recommendation engine for attendee matchmaking', dateTime: { start: '2025-03-18T14:45:00', end: '2025-03-18T16:45:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Workshop Lab A', address: '747 Howard St, San Francisco', dressCode: 'Casual' } },
  { id: 'sch-9', name: 'Workshop: Mastering Event Data & Analytics', description: 'Learn to measure ROI, track engagement, and make data-driven decisions', dateTime: { start: '2025-03-18T14:45:00', end: '2025-03-18T16:45:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Workshop Lab B', address: '747 Howard St, San Francisco', dressCode: 'Casual' } },
  { id: 'sch-10', name: 'Afternoon Break', description: 'Refreshments in Expo Hall - last chance to visit exhibitors today', dateTime: { start: '2025-03-18T16:45:00', end: '2025-03-18T17:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Expo Hall', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-11', name: 'Fireside Chat: Lessons from 10,000 Events', description: 'Marcus Johnson shares hard-won insights from a decade of large-scale event production', dateTime: { start: '2025-03-18T17:15:00', end: '2025-03-18T18:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-12', name: 'Welcome Reception', description: 'Cocktails, hors d\'oeuvres, and live music. Meet the speakers and fellow attendees.', dateTime: { start: '2025-03-18T18:30:00', end: '2025-03-18T21:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'City View Terrace', address: '747 Howard St, San Francisco', dressCode: 'Smart Casual' } },

  // ===== DAY 2: Wednesday, March 19, 2025 =====
  { id: 'sch-13', name: 'Sunrise Yoga & Wellness', description: 'Optional morning stretch session - all levels welcome. Mats provided.', dateTime: { start: '2025-03-19T06:30:00', end: '2025-03-19T07:30:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Yerba Buena Gardens', address: 'Adjacent to Moscone Center', dressCode: 'Athletic Wear' } },
  { id: 'sch-14', name: 'Breakfast & Networking', description: 'Full breakfast buffet with themed networking tables', dateTime: { start: '2025-03-19T07:30:00', end: '2025-03-19T08:45:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Terrace Restaurant', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-15', name: 'Day 2 Keynote: Designing Experiences That Matter', description: 'Emily Rodriguez on the psychology of memorable events and emotional design', dateTime: { start: '2025-03-19T09:00:00', end: '2025-03-19T10:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-16', name: 'Breakout: Security & Safety Best Practices', description: 'From crowd management to cybersecurity - protecting your attendees and data', dateTime: { start: '2025-03-19T10:15:00', end: '2025-03-19T11:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 201', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-17', name: 'Breakout: Sponsorship Innovation', description: 'Creative sponsorship models that deliver value to all stakeholders', dateTime: { start: '2025-03-19T10:15:00', end: '2025-03-19T11:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 202', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-18', name: 'Breakout: Accessible Events for All', description: 'Creating inclusive experiences that welcome every attendee', dateTime: { start: '2025-03-19T10:15:00', end: '2025-03-19T11:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 203', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-19', name: 'Coffee Break', description: 'Refreshments in Expo Hall', dateTime: { start: '2025-03-19T11:15:00', end: '2025-03-19T11:45:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Expo Hall', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-20', name: 'Panel: The Future of B2B Events', description: 'CMOs and event leaders discuss how business events are evolving post-pandemic', dateTime: { start: '2025-03-19T11:45:00', end: '2025-03-19T12:45:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-21', name: 'Lunch & Learn: Table Topics', description: 'Join expert-led roundtable discussions on trending topics while you dine', dateTime: { start: '2025-03-19T12:45:00', end: '2025-03-19T14:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Terrace Restaurant', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-22', name: 'Workshop: Budget Mastery for Event Planners', description: 'Practical strategies for maximizing impact while controlling costs', dateTime: { start: '2025-03-19T14:30:00', end: '2025-03-19T16:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Workshop Lab A', address: '747 Howard St, San Francisco', dressCode: 'Casual' } },
  { id: 'sch-23', name: 'Workshop: Video Production on Any Budget', description: 'Create professional event content with tools you already have', dateTime: { start: '2025-03-19T14:30:00', end: '2025-03-19T16:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Workshop Lab B', address: '747 Howard St, San Francisco', dressCode: 'Casual' } },
  { id: 'sch-24', name: 'Innovation Showcase', description: 'Startups pitch their event tech solutions - vote for your favorite!', dateTime: { start: '2025-03-19T16:15:00', end: '2025-03-19T17:30:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-25', name: 'Free Evening / Dine-Arounds', description: 'Optional group dinners at local restaurants - sign up at registration desk', dateTime: { start: '2025-03-19T18:00:00', end: '2025-03-19T21:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Various San Francisco Restaurants', address: 'See signup board', dressCode: 'Smart Casual' } },

  // ===== DAY 3: Thursday, March 20, 2025 =====
  { id: 'sch-26', name: 'Breakfast', description: 'Final day breakfast - grab your coffee and head to the closing sessions', dateTime: { start: '2025-03-20T07:30:00', end: '2025-03-20T08:45:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Terrace Restaurant', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-27', name: 'Case Study: Behind the Scenes of Dreamforce', description: 'Exclusive look at how Salesforce produces one of the world\'s largest tech conferences', dateTime: { start: '2025-03-20T09:00:00', end: '2025-03-20T10:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-28', name: 'Breakout: Crisis Management & Contingency Planning', description: 'Be prepared for anything - from weather emergencies to last-minute speaker cancellations', dateTime: { start: '2025-03-20T10:15:00', end: '2025-03-20T11:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 201', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-29', name: 'Breakout: Building Your Event Tech Stack', description: 'Navigate the crowded vendor landscape and choose the right tools', dateTime: { start: '2025-03-20T10:15:00', end: '2025-03-20T11:15:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Room 202', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-30', name: 'Coffee Break & Expo Hall Final Hour', description: 'Last chance to connect with exhibitors and collect your swag', dateTime: { start: '2025-03-20T11:15:00', end: '2025-03-20T12:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Expo Hall', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-31', name: 'Awards Ceremony: Event Excellence Awards', description: 'Celebrating the most innovative events and outstanding professionals of the year', dateTime: { start: '2025-03-20T12:00:00', end: '2025-03-20T13:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-32', name: 'Closing Keynote: What\'s Next', description: 'Industry predictions and a look ahead to next year\'s conference', dateTime: { start: '2025-03-20T13:00:00', end: '2025-03-20T14:00:00', timeZone: 'America/Los_Angeles' }, eventMode: 'hybrid', privacy: { visibility: 'public' }, inPerson: { venue: 'Main Stage', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
  { id: 'sch-33', name: 'Farewell Lunch & Networking', description: 'Final opportunity to exchange contact info and say goodbye to new friends', dateTime: { start: '2025-03-20T14:00:00', end: '2025-03-20T15:30:00', timeZone: 'America/Los_Angeles' }, eventMode: 'in-person', privacy: { visibility: 'public' }, inPerson: { venue: 'Terrace Restaurant', address: '747 Howard St, San Francisco', dressCode: 'Business Casual' } },
];

const samplePeople = [
  // Keynote Speakers
  { id: 'ppl-1', firstName: 'Sarah', lastName: 'Chen', title: 'CEO & Founder', company: 'EventTech Inc', bio: 'Pioneer in event technology with 15 years of experience building platforms used by Fortune 500 companies. Named "Event Innovator of the Year" by Event Manager Blog in 2024.', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', roleTypes: ['speaker', 'vip'], links: [{ type: 'linkedin', url: 'https://linkedin.com' }], sessionIds: ['sch-2'] },
  { id: 'ppl-2', firstName: 'Marcus', lastName: 'Johnson', title: 'SVP of Global Events', company: 'Future Events Co', bio: 'Over 10,000 events produced across 45 countries. Expert in large-scale logistics and sustainable event practices. Regular contributor to Event Industry News.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', roleTypes: ['speaker', 'vip'], links: [{ type: 'linkedin', url: 'https://linkedin.com' }, { type: 'twitter', url: 'https://twitter.com' }], sessionIds: ['sch-11', 'sch-32'] },
  { id: 'ppl-3', firstName: 'Emily', lastName: 'Rodriguez', title: 'Chief Experience Officer', company: 'Memorable Moments', bio: 'Award-winning experience designer who pioneered the concept of "emotional event architecture." Author of "The Experience Economy: A Field Guide for Event Planners."', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', roleTypes: ['speaker', 'vip'], links: [{ type: 'website', url: 'https://emilyrodriguez.com' }], sessionIds: ['sch-15'] },
  
  // Workshop Leaders
  { id: 'ppl-4', firstName: 'David', lastName: 'Kim', title: 'AI Research Lead', company: 'EventTech Inc', bio: 'PhD in Machine Learning from Stanford. Building AI systems that transform how attendees discover content and connect with each other at events.', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-8'] },
  { id: 'ppl-5', firstName: 'Amanda', lastName: 'Foster', title: 'Director of Analytics', company: 'Eventbrite', bio: 'Data scientist turned event strategist. Helps organizations measure what matters and turn insights into action.', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [{ type: 'linkedin', url: 'https://linkedin.com' }], sessionIds: ['sch-9'] },
  { id: 'ppl-6', firstName: 'Robert', lastName: 'Martinez', title: 'CFO', company: 'Conference Direct', bio: 'Former event planner turned financial strategist. Known for helping events achieve 40% better ROI through smart budgeting.', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-22'] },
  { id: 'ppl-7', firstName: 'Lisa', lastName: 'Chang', title: 'Head of Content', company: 'Vimeo Events', bio: 'Emmy-nominated producer bringing broadcast quality to live events. Specialist in hybrid event production.', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-23'] },
  
  // Panelists
  { id: 'ppl-8', firstName: 'James', lastName: 'Wilson', title: 'VP of Marketing', company: 'Salesforce', bio: 'Oversees event strategy for Dreamforce and World Tour events. 20+ years in experiential marketing.', photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop', roleTypes: ['panelist', 'vip'], links: [], sessionIds: ['sch-7', 'sch-20', 'sch-27'] },
  { id: 'ppl-9', firstName: 'Priya', lastName: 'Sharma', title: 'Global Events Director', company: 'Google', bio: 'Leads hybrid strategy for Google I/O and Cloud Next. Passionate about making virtual attendees feel like first-class participants.', photoUrl: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop', roleTypes: ['panelist'], links: [{ type: 'linkedin', url: 'https://linkedin.com' }], sessionIds: ['sch-7'] },
  { id: 'ppl-10', firstName: 'Michael', lastName: 'Thompson', title: 'Founder', company: 'EventGuard Security', bio: 'Former Secret Service agent specializing in event security and crowd management. Consultant for major festivals and political conventions.', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-16', 'sch-28'] },
  { id: 'ppl-11', firstName: 'Rachel', lastName: 'Green', title: 'Accessibility Consultant', company: 'All Access Events', bio: 'Disability rights advocate ensuring events welcome everyone. Created the industry-standard Accessible Event Checklist.', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [{ type: 'website', url: 'https://allaccessevents.org' }], sessionIds: ['sch-18'] },
  { id: 'ppl-12', firstName: 'Thomas', lastName: 'Anderson', title: 'Chief Revenue Officer', company: 'Freeman', bio: 'Transforming how sponsors engage with event audiences. Pioneer of data-driven sponsorship valuation.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-17'] },
  
  // Breakout Session Speakers
  { id: 'ppl-13', firstName: 'Nicole', lastName: 'Baker', title: 'Sustainability Director', company: 'Green Events Alliance', bio: 'Helping the events industry achieve net-zero. Led carbon-neutral certification for over 200 events.', photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-4'] },
  { id: 'ppl-14', firstName: 'Kevin', lastName: 'O\'Brien', title: 'Community Manager', company: 'Meetup', bio: 'Built communities of over 500,000 members. Expert in year-round engagement strategies and community building.', photoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [{ type: 'twitter', url: 'https://twitter.com' }], sessionIds: ['sch-5'] },
  { id: 'ppl-15', firstName: 'Jennifer', lastName: 'Lee', title: 'CTO', company: 'EventStack', bio: 'Building the future of event technology integration. Former Amazon engineer with a passion for seamless attendee experiences.', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-29'] },
  
  // Conference Staff
  { id: 'ppl-16', firstName: 'Chris', lastName: 'Taylor', title: 'Conference Chair', company: 'Event Industry Association', bio: 'Organizing the Event Innovation Summit for its 8th year. Dedicated to advancing the profession of event management.', photoUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop', roleTypes: ['host', 'vip'], links: [], sessionIds: ['sch-31', 'sch-32'] },
  { id: 'ppl-17', firstName: 'Samantha', lastName: 'Davis', title: 'Program Director', company: 'Event Industry Association', bio: 'Curates world-class content and ensures every session delivers actionable value for attendees.', photoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop', roleTypes: ['host'], links: [], sessionIds: [] },
  { id: 'ppl-18', firstName: 'Alex', lastName: 'Rivera', title: 'Wellness Instructor', company: 'Mindful Events', bio: 'Certified yoga instructor bringing wellness practices to the corporate event space. Believes healthy events start with healthy attendees.', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop', roleTypes: ['speaker'], links: [], sessionIds: ['sch-13'] },
];

const sampleHotels = [
  { id: 'htl-1', name: 'San Francisco Marriott Marquis', notes: 'Official conference hotel with exclusive $259/night rate for attendees. Connected to Moscone Center via skybridge. Book using code "EVENTSUMMIT25" for the group rate.', photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop', starRating: 4, distanceKm: 0.1, address: '780 Mission Street, San Francisco', url: 'https://marriott.com' },
  { id: 'htl-2', name: 'Hotel Vitale', notes: 'Boutique waterfront hotel on the Embarcadero. Complimentary morning yoga on the terrace. 15-minute walk to venue through scenic downtown.', photoUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop', starRating: 4, distanceKm: 1.0, address: '8 Mission Street, San Francisco', url: 'https://hotelvitale.com' },
  { id: 'htl-3', name: 'The Mosser', notes: 'Budget-friendly option right across from Moscone. No-frills but clean rooms in a historic building. Perfect if you\'re spending all your time at the conference anyway.', photoUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&h=200&fit=crop', starRating: 3, distanceKm: 0.1, address: '54 Fourth Street, San Francisco', url: 'https://themosser.com' },
  { id: 'htl-4', name: 'Four Seasons San Francisco', notes: 'Luxury option for VIPs and those who want premium service. Club lounge, spa, and exceptional dining. 5-minute walk to Moscone.', photoUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop', starRating: 5, distanceKm: 0.4, address: '757 Market Street, San Francisco', url: 'https://fourseasons.com/sanfrancisco' },
  { id: 'htl-5', name: 'Hyatt Place San Francisco Downtown', notes: 'Great value with free breakfast included. Modern rooms with separate work area. Easy walk through SoMa neighborhood.', photoUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop', starRating: 3, distanceKm: 0.6, address: '701 Third Street, San Francisco', url: 'https://hyatt.com' },
];

const sampleFaqs = [
  // General
  { id: 'faq-1', question: 'What are the conference dates and times?', answer: 'The Event Innovation Summit runs Tuesday, March 18 through Thursday, March 20, 2025. Registration opens at 7:30 AM each day. Sessions begin at 9:00 AM and typically conclude by 6:00 PM, except Day 1 which includes an evening reception until 9:00 PM.', category: 'General' },
  { id: 'faq-2', question: 'What is the dress code?', answer: 'Business casual for all daytime sessions. Smart casual is appropriate for the Welcome Reception on Tuesday evening. Comfortable shoes are highly recommended - Moscone Center is a large venue with lots of walking. Workshops are casual, and the sunrise yoga session requires athletic wear.', category: 'General' },
  { id: 'faq-3', question: 'Where is the conference located?', answer: 'The conference is held at Moscone Center, 747 Howard Street, San Francisco, CA 94103. All sessions, meals, and the Expo Hall are in Hall A and the connected meeting rooms. The Welcome Reception is on the City View Terrace on the 4th floor.', category: 'General' },
  
  // Registration & Access
  { id: 'faq-4', question: 'What does my registration include?', answer: 'Your full conference pass includes access to all keynotes, breakout sessions, panels, and workshops for all three days. It also includes daily breakfast, lunch, coffee breaks, the Welcome Reception, access to the Expo Hall, and on-demand session recordings after the event.', category: 'Registration' },
  { id: 'faq-5', question: 'Can I attend virtually?', answer: 'Yes! We offer a virtual pass that includes livestreaming of all Main Stage sessions (keynotes, panels, and fireside chats). Virtual attendees also get access to session recordings and can participate in Q&A via the event platform. Note: Workshops are in-person only.', category: 'Registration' },
  { id: 'faq-6', question: 'Is there a day pass option?', answer: 'Yes, single-day passes are available for $399. Please visit our registration page to select the specific day you wish to attend. Day passes include all sessions, meals, and Expo Hall access for that day only.', category: 'Registration' },
  
  // Logistics
  { id: 'faq-7', question: 'Is parking available?', answer: 'Moscone Center has an underground parking garage at 255 Third Street. Daily rate is $40, or you can validate at the registration desk for a discounted rate of $25/day. We recommend public transit or rideshare - the Powell Street BART station is a 10-minute walk.', category: 'Logistics' },
  { id: 'faq-8', question: 'Is there a coat check?', answer: 'Yes, complimentary coat check is available in the Hall A lobby near registration. Hours are 7:00 AM to 7:00 PM daily (extended to 9:30 PM on Tuesday for the reception).', category: 'Logistics' },
  { id: 'faq-9', question: 'Will there be WiFi?', answer: 'Yes, complimentary high-speed WiFi is available throughout the venue. Network: EventSummit2025 | Password: Innovate2025! (case-sensitive). For bandwidth-intensive needs, visit the tech support desk in the Expo Hall.', category: 'Logistics' },
  
  // Content & Sessions
  { id: 'faq-10', question: 'Will sessions be recorded?', answer: 'Yes, all Main Stage sessions will be professionally recorded and available to registered attendees within 48 hours via our event platform. Most breakout sessions will also be recorded. Workshop sessions are NOT recorded to allow for candid discussion.', category: 'Content' },
  { id: 'faq-11', question: 'How do I choose which sessions to attend?', answer: 'Download our mobile app (EventSummit 2025 on iOS/Android) to browse the full schedule, read session descriptions, and build your personalized agenda. Sessions with limited capacity (workshops) require advance sign-up in the app.', category: 'Content' },
  { id: 'faq-12', question: 'Can I get continuing education credits?', answer: 'Yes! This conference is approved for 18 CEU credits through the Events Industry Council. Stop by the registration desk with your CMP/CMM ID to register your attendance. You must attend sessions totaling at least 15 hours over the three days.', category: 'Content' },
  
  // Food & Dietary
  { id: 'faq-13', question: 'Are meals included?', answer: 'Full breakfast and lunch are included all three days. Coffee, tea, and snacks are available during all breaks. The Tuesday Welcome Reception includes substantial hors d\'oeuvres and drinks. Wednesday evening is open for the optional dine-around program.', category: 'Food & Beverage' },
  { id: 'faq-14', question: 'How do I indicate dietary restrictions?', answer: 'Please update your dietary requirements in your registration profile at least 7 days before the event. We accommodate vegetarian, vegan, gluten-free, kosher, halal, and common food allergies. Look for color-coded labels at all meal stations. For severe allergies, please contact catering@eventsummit.com.', category: 'Food & Beverage' },
  { id: 'faq-15', question: 'Is alcohol served?', answer: 'Beer, wine, and signature cocktails will be served at the Tuesday Welcome Reception (included in registration). A cash bar is available. Non-alcoholic options including mocktails are always available. Please drink responsibly.', category: 'Food & Beverage' },
  
  // Networking
  { id: 'faq-16', question: 'How can I connect with other attendees?', answer: 'Download the event app to see the attendee list, send messages, and schedule 1:1 meetings. Look for themed networking tables at lunch. Join a Wednesday dine-around group. Visit the Networking Lounge adjacent to the Expo Hall anytime during the event.', category: 'Networking' },
  { id: 'faq-17', question: 'How do I sign up for the dine-around?', answer: 'The Wednesday evening dine-around features curated group dinners at 8 local restaurants. Sign up at the registration desk by Wednesday at noon. Group sizes are 8-12 people. You pay for your own meal. It\'s a great way to build deeper connections!', category: 'Networking' },
];

const sampleTravel = [
  // Airports
  { id: 'trv-1', itemType: 'airport', title: 'San Francisco International Airport (SFO)', notes: 'Primary airport, 14 miles south of downtown. BART runs directly from the airport to Powell Street Station ($9.65, 30 min). Rideshare/taxi takes 25-45 min depending on traffic ($35-50).', links: [{ label: 'Airport Website', url: 'https://flysfo.com' }], phone: '+1 650-821-8211' },
  { id: 'trv-2', itemType: 'airport', title: 'Oakland International Airport (OAK)', notes: 'Often cheaper flights, 20 miles east. Take BART from OAK to Powell Street ($11.05, 45 min). Good option if flying Southwest or JetBlue.', links: [{ label: 'Airport Website', url: 'https://oaklandairport.com' }], phone: '+1 510-563-3300' },
  { id: 'trv-3', itemType: 'airport', title: 'San Jose International Airport (SJC)', notes: 'Best for South Bay connections, 50 miles south. VTA Light Rail + Caltrain to SF, or rideshare (~$80-100). Consider only if significantly cheaper flights.', links: [{ label: 'Airport Website', url: 'https://flysanjose.com' }], phone: '+1 408-392-3600' },
  
  // Ground Transportation
  { id: 'trv-4', itemType: 'rideshare', title: 'Uber / Lyft', notes: 'Readily available throughout the city. From SFO: pickup on Level 5 of parking garage (follow signs). Typical fare to Moscone: $35-50. Surge pricing common during rush hour.', links: [{ label: 'Uber', url: 'https://uber.com' }, { label: 'Lyft', url: 'https://lyft.com' }], phone: null },
  { id: 'trv-5', itemType: 'transit', title: 'BART (Bay Area Rapid Transit)', notes: 'From SFO or OAK: Take any SF-bound train to Powell Street Station, then walk 10 minutes south to Moscone or take Muni. Trains run 5am-midnight weekdays, 6am-midnight weekends. Buy a Clipper card for easier travel.', links: [{ label: 'BART Trip Planner', url: 'https://bart.gov' }], phone: '+1 510-465-2278' },
  { id: 'trv-6', itemType: 'transit', title: 'Muni (SF Public Transit)', notes: 'Buses and light rail throughout SF. The N-Judah and T-Third lines stop near Moscone. Single ride $3 or unlimited day pass $13. Free transfers within 2 hours with Clipper.', links: [{ label: 'Muni Website', url: 'https://sfmta.com' }], phone: '+1 311' },
  { id: 'trv-7', itemType: 'rental', title: 'Car Rental', notes: 'All major agencies at SFO. Not recommended for downtown SF - parking is expensive ($40-60/day) and traffic is heavy. Useful only if you plan to explore Napa, Muir Woods, or other day trips.', links: [], phone: null },
  { id: 'trv-8', itemType: 'taxi', title: 'Yellow Cab / Flywheel', notes: 'Traditional taxis available at airport taxi stands and can be hailed downtown. Flat rate from SFO to downtown: $55. Tip: Flywheel app lets you hail and pay by card.', links: [{ label: 'Flywheel App', url: 'https://flywheel.com' }], phone: '+1 415-333-3333' },
];

const sampleAttractions = [
  // Must See Landmarks
  { id: 'att-1', name: 'Golden Gate Bridge', category: 'Landmark', description: 'Iconic suspension bridge with stunning views. Best visited early morning or sunset for photos. Walk or bike across for the full experience.', photoUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop', location: 'Golden Gate Bridge, San Francisco', link: 'https://goldengatebridge.org', groupLabel: 'Must See' },
  { id: 'att-2', name: 'Alcatraz Island', category: 'Historic Site', description: 'Former federal prison on an island in the bay. Book tickets well in advance - the night tour is especially atmospheric. Ferries depart from Pier 33.', photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop', location: 'Alcatraz Island, San Francisco Bay', link: 'https://alcatrazcruises.com', groupLabel: 'Must See' },
  { id: 'att-3', name: 'Fisherman\'s Wharf & Pier 39', category: 'Neighborhood', description: 'Touristy but fun waterfront district with seafood restaurants, souvenir shops, and resident sea lions. Try the clam chowder in a sourdough bread bowl.', photoUrl: 'https://images.unsplash.com/photo-1534050359320-02900022671e?w=300&h=200&fit=crop', location: 'Fisherman\'s Wharf, San Francisco', link: 'https://pier39.com', groupLabel: 'Must See' },
  { id: 'att-4', name: 'Cable Cars', category: 'Experience', description: 'The only moving National Historic Landmark. Take the Powell-Hyde line for the best views. Pro tip: board at the California Street terminus to skip the long lines.', photoUrl: 'https://images.unsplash.com/photo-1534050359320-02900022671e?w=300&h=200&fit=crop', location: 'Powell & Market Streets', link: 'https://sfcablecar.com', groupLabel: 'Must See' },

  // Local Favorites - Food
  { id: 'att-5', name: 'Tartine Bakery', category: 'Bakery', description: 'World-famous bakery known for morning buns and country bread. Expect a line but worth the wait. The croissants sell out early.', photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop', location: '600 Guerrero St, Mission District', link: 'https://tartinebakery.com', groupLabel: 'Local Favorites' },
  { id: 'att-6', name: 'Swan Oyster Depot', category: 'Seafood', description: 'Counter-only seafood institution since 1912. Cash only, no reservations. The crab salad and Dungeness crab are legendary. Opens 10:30 AM, line forms early.', photoUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop', location: '1517 Polk Street, Nob Hill', link: null, groupLabel: 'Local Favorites' },
  { id: 'att-7', name: 'Benu', category: 'Fine Dining', description: 'Three Michelin star restaurant from Corey Lee. Modern cuisine inspired by Asian techniques. Requires reservations months in advance. $$$$$', photoUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop', location: '22 Hawthorne St, SoMa (near Moscone)', link: 'https://benusf.com', groupLabel: 'Local Favorites' },
  { id: 'att-8', name: 'La Taqueria', category: 'Mexican', description: 'Legendary Mission District taqueria. Their carnitas burrito was named America\'s best. No rice or beans - just meat, salsa, and happiness.', photoUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=200&fit=crop', location: '2889 Mission Street', link: null, groupLabel: 'Local Favorites' },
  
  // Neighborhoods
  { id: 'att-9', name: 'The Mission District', category: 'Neighborhood', description: 'Vibrant Latino neighborhood with amazing murals in Balmy Alley, trendy bars, and the best burritos in the city. Don\'t miss Dolores Park on a sunny day.', photoUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop', location: 'Mission District', link: null, groupLabel: 'Explore' },
  { id: 'att-10', name: 'Chinatown', category: 'Neighborhood', description: 'The oldest Chinatown in North America. Enter through the Dragon Gate on Grant Avenue. Dim sum, tea shops, and fascinating history.', photoUrl: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?w=300&h=200&fit=crop', location: 'Chinatown, around Grant Avenue', link: null, groupLabel: 'Explore' },
  { id: 'att-11', name: 'Hayes Valley', category: 'Neighborhood', description: 'Hip neighborhood perfect for walkable shopping and dining. Near Moscone - great for a lunch break. Check out Smitten Ice Cream and Blue Bottle Coffee.', photoUrl: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=300&h=200&fit=crop', location: 'Hayes Valley, near Civic Center', link: null, groupLabel: 'Explore' },
  
  // Activities
  { id: 'att-12', name: 'SF MOMA', category: 'Museum', description: 'World-class modern art museum just steps from Moscone Center. The living wall and rooftop sculpture garden are free to visit.', photoUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=300&h=200&fit=crop', location: '151 Third Street (2 blocks from Moscone)', link: 'https://sfmoma.org', groupLabel: 'Culture' },
  { id: 'att-13', name: 'Ferry Building Marketplace', category: 'Market', description: 'Foodie paradise in a historic ferry terminal. Saturday farmers market is spectacular. Great coffee, cheese, oysters, and local food vendors.', photoUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=300&h=200&fit=crop', location: '1 Ferry Building, Embarcadero', link: 'https://ferrybuildingmarketplace.com', groupLabel: 'Culture' },
];

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  // Layout - wider and more spacious
  container: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: '960px',
    margin: '0 auto',
    padding: '48px 32px',
    minHeight: '100vh',
    background: '#fff',
  },
  
  // Navigation - cleaner, more spacious
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '56px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
    flexWrap: 'wrap',
  },
  navButton: {
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navButtonActive: {
    background: '#18181b',
    color: '#fff',
  },
  navButtonInactive: {
    background: 'transparent',
    color: '#6b7280',
  },
  
  // Header - more breathing room
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    minHeight: '44px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1D1D1F',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  
  // Buttons - larger touch targets, softer styling
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: '-0.01rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  modeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#fff',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: '-0.01rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  modeButtonActive: {
    background: '#f9fafb',
    color: '#1D1D1F',
    borderColor: '#111827',
  },
  dangerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: '-0.01rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  ghostButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: 'transparent',
    color: '#6b7280',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: '-0.01rem',
    cursor: 'pointer',
    transition: 'color 0.15s ease, background 0.15s ease, transform 0.1s ease',
  },
  
  // List - cleaner, no harsh borders
  list: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '24px 24px 16px',
    background: '#fafafa',
    fontSize: '12px',
    fontWeight: '400',
    color: '#9ca3af',
    letterSpacing: '0.01em',
    transition: 'opacity 0.2s ease',
  },
  
  // Row base - more spacious
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    padding: '20px 24px',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    position: 'relative',
    borderBottom: '1px solid #f5f5f5',
  },
  rowHover: {
    background: '#fafafa',
  },
  rowSelected: {
    background: '#f0f9ff',
  },
  rowDragging: {
    background: '#fff',
    boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
    borderRadius: '12px',
    zIndex: 100,
  },
  
  // Row elements - with animation support
  rowLeadingAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    transition: 'width 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    color: '#9ca3af',
    cursor: 'grab',
    flexShrink: 0,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '5px',
    border: '1.5px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  checkboxChecked: {
    background: '#111827',
    borderColor: '#111827',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    background: 'transparent',
    color: '#9ca3af',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'opacity 0.2s ease, transform 0.2s ease, color 0.15s ease',
    opacity: 0,
    transform: 'scale(0.8)',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  deleteButtonVisible: {
    opacity: 1,
    transform: 'scale(1)',
  },
  
  // Row content - better typography
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  rowPrimary: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#1D1D1F',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.4',
    letterSpacing: '-0.01rem',
  },
  rowSecondary: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
    letterSpacing: '-0.01em',
  },
  rowTertiary: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#9ca3af',
    marginTop: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
    letterSpacing: '0.005em',
  },
  
  // Specific row types - larger, more comfortable
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff',
    flexShrink: 0,
  },
  avatarStack: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  thumbnail: {
    width: '88px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  pill: {
    display: 'inline-block',
    padding: '5px 12px',
    background: '#f3f4f6',
    color: '#6b7280',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.01em',
  },
  timeBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#f9fafb',
    borderRadius: '10px',
    minWidth: '76px',
    flexShrink: 0,
  },
  timeText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    letterSpacing: '-0.01em',
  },
  timeDivider: {
    fontSize: '11px',
    color: '#9ca3af',
    margin: '4px 0',
    letterSpacing: '0.02em',
  },
  stars: {
    display: 'flex',
    gap: '2px',
    color: '#fbbf24',
  },
  
  // Empty state - more inviting
  emptyState: {
    padding: '80px 32px',
    textAlign: 'center',
    background: '#fafafa',
    borderRadius: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: '10px',
    letterSpacing: '-0.015em',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '28px',
    lineHeight: '1.5',
    letterSpacing: '-0.01rem',
  },
  
  // Modal - light, modern, airy
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.15)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
    overflow: 'hidden',
    overscrollBehavior: 'contain',
  },
  modal: {
    position: 'relative',
    background: '#fff',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.25s ease',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  modalClose: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.15s ease',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  modalHeader: {
    padding: '32px 32px 0',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1D1D1F',
    margin: 0,
    letterSpacing: '-0.02em',
    paddingRight: '40px',
  },
  modalBody: {
    padding: '28px 32px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    flex: 1,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px 28px',
    flexShrink: 0,
    borderTop: '1px solid #f3f4f6',
    background: '#fafafa',
    borderRadius: '0 0 20px 20px',
  },
  
  // Form elements - clean, minimal
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#6b7280',
    letterSpacing: '0',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#1D1D1F',
    letterSpacing: '-0.01rem',
    background: '#fff',
    transition: 'all 0.15s ease',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '12px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#1D1D1F',
    letterSpacing: '-0.01rem',
    background: '#fff',
    resize: 'vertical',
    minHeight: '80px',
    fontFamily: 'inherit',
    outline: 'none',
    lineHeight: '1.5',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    padding: '12px 14px',
    paddingRight: '36px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#1D1D1F',
    letterSpacing: '-0.01rem',
    background: '#fff',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.15s ease',
    width: '100%',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Phone number formatter
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

// ============================================================================
// SMART FORM COMPONENTS
// ============================================================================

// Image URL input with live preview
const ImageUrlInput = ({ value, onChange, placeholder = 'Paste image URL...' }) => {
  const [isValid, setIsValid] = useState(false);
  
  React.useEffect(() => {
    if (value && value.startsWith('http')) {
      const img = new Image();
      img.onload = () => setIsValid(true);
      img.onerror = () => setIsValid(false);
      img.src = value;
    } else {
      setIsValid(false);
    }
  }, [value]);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {isValid && (
        <div style={{
          width: '100%',
          height: '140px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f5f5f7',
        }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type="url"
          style={{
            ...styles.input,
            paddingLeft: '40px',
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
        }}>
          {isValid ? '🖼️' : '🔗'}
        </div>
      </div>
    </div>
  );
};

// Interactive star rating
const StarRatingInput = ({ value, onChange, max = 5 }) => {
  const [hover, setHover] = useState(null);
  
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '8px 0' }}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hover ?? value);
        return (
          <button
            key={index}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              transition: 'transform 0.15s ease',
              transform: isFilled ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(starValue)}
          >
            <Star 
              size={28} 
              fill={isFilled ? '#fbbf24' : 'transparent'}
              color={isFilled ? '#fbbf24' : '#d1d5db'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      <span style={{ 
        marginLeft: '12px', 
        fontSize: '14px', 
        color: '#6b7280',
        alignSelf: 'center',
      }}>
        {value} star{value !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

// Phone input with formatting
const PhoneInput = ({ value, onChange, placeholder = '(555) 123-4567' }) => {
  const handleChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="tel"
        style={{
          ...styles.input,
          paddingLeft: '40px',
        }}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
        fontSize: '16px',
      }}>
        📞
      </div>
    </div>
  );
};

// URL input with external link
const UrlInput = ({ value, onChange, placeholder = 'https://...' }) => {
  const isValid = value && value.startsWith('http');
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="url"
        style={{
          ...styles.input,
          paddingLeft: '40px',
          paddingRight: isValid ? '44px' : '16px',
        }}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
        fontSize: '14px',
      }}>
        🌐
      </div>
      {isValid && (
        <button
          type="button"
          onClick={() => window.open(value, '_blank')}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            color: '#3b82f6',
            fontSize: '14px',
          }}
          title="Open in new tab"
        >
          ↗
        </button>
      )}
    </div>
  );
};

// Segmented control for options
const SegmentedControl = ({ value, onChange, options }) => {
  return (
    <div style={{
      display: 'flex',
      background: '#f5f5f7',
      borderRadius: '10px',
      padding: '4px',
      gap: '4px',
    }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: value === option.value ? '#fff' : 'transparent',
            color: value === option.value ? '#1D1D1F' : '#6b7280',
            boxShadow: value === option.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Distance input with visual slider
const DistanceInput = ({ value, onChange, unit = 'km', max = 10 }) => {
  const displayValue = unit === 'mi' ? (value * 0.621371).toFixed(1) : value;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="range"
          min="0"
          max={max}
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            appearance: 'none',
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(value / max) * 100}%, #e5e7eb ${(value / max) * 100}%, #e5e7eb 100%)`,
            cursor: 'pointer',
          }}
        />
        <span style={{
          minWidth: '80px',
          padding: '8px 12px',
          background: '#f5f5f7',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1D1D1F',
          textAlign: 'center',
        }}>
          {displayValue} {unit}
        </span>
      </div>
    </div>
  );
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================================================
// SORTABLE ROW WRAPPER
// ============================================================================

const SortableRow = ({ id, children, mode, isSelected, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? styles.rowDragging : {}),
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners, isDragging })}
    </div>
  );
};

// ============================================================================
// ROW COMPONENTS
// ============================================================================

const ScheduleRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners, people = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Find people linked to this session
  const linkedPeople = people.filter(p => (p.sessionIds || []).includes(item.id));
  
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
        cursor: mode === 'reorder' ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      {/* Animated leading action container */}
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        marginRight: showLeadingAction ? '0px' : '-12px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={13} color="#fff" />}
          </div>
        )}
      </div>
      <div style={styles.timeBlock}>
        <span style={styles.timeText}>{formatTime(item.dateTime.start)}</span>
        <span style={styles.timeDivider}>—</span>
        <span style={styles.timeText}>{formatTime(item.dateTime.end)}</span>
      </div>
      <div style={styles.rowContent}>
        <div style={styles.rowPrimary}>{item.name}</div>
        <div style={styles.rowSecondary}>{item.description}</div>
        <div style={styles.rowTertiary}>
          {item.inPerson?.venue && (
            <span>
              <MapPin size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {item.inPerson.venue}
            </span>
          )}
        </div>
        {/* Speakers with photos */}
        {linkedPeople.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <div style={styles.avatarStack}>
              {linkedPeople.slice(0, 4).map((person, index) => (
                <img
                  key={person.id}
                  src={person.photoUrl}
                  alt={`${person.firstName} ${person.lastName}`}
                  style={{
                    ...styles.avatarSmall,
                    marginLeft: index === 0 ? 0 : '-8px',
                    zIndex: linkedPeople.length - index,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {linkedPeople.length === 1 
                ? `${linkedPeople[0].firstName} ${linkedPeople[0].lastName}`
                : linkedPeople.length === 2
                  ? `${linkedPeople[0].firstName} ${linkedPeople[0].lastName} & ${linkedPeople[1].firstName} ${linkedPeople[1].lastName}`
                  : `${linkedPeople[0].firstName} ${linkedPeople[0].lastName} + ${linkedPeople.length - 1} more`
              }
            </span>
          </div>
        )}
      </div>
      {/* Delete button - always rendered, animated visibility */}
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
          visibility: mode === 'default' ? 'visible' : 'hidden',
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, item.name);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const PersonRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
        cursor: mode === 'reorder' ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        marginRight: showLeadingAction ? '0px' : '-12px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={13} color="#fff" />}
          </div>
        )}
      </div>
      <img src={item.photoUrl} alt={`${item.firstName} ${item.lastName}`} style={styles.avatar} />
      <div style={styles.rowContent}>
        <div style={styles.rowPrimary}>{item.firstName} {item.lastName}</div>
        <div style={styles.rowSecondary}>
          {item.title}{item.company && ` · ${item.company}`}
          {item.sessionIds?.length > 0 && (
            <span style={{ color: '#a1a1aa', marginLeft: '8px' }}>
              · {item.sessionIds.length} session{item.sessionIds.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      {item.roleTypes?.length > 0 && (
        <span style={{ ...styles.pill, transition: 'opacity 0.2s ease', opacity: mode === 'default' ? 1 : 0.5 }}>{item.roleTypes[0]}</span>
      )}
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
          visibility: mode === 'default' ? 'visible' : 'hidden',
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, `${item.firstName} ${item.lastName}`);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const HotelRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  // Convert km to miles
  const distanceMiles = (item.distanceKm * 0.621371).toFixed(1);
  const distanceText = distanceMiles < 0.15 ? 'Adjacent to venue' : `${distanceMiles} mi from venue`;
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
        cursor: mode === 'reorder' ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        marginRight: showLeadingAction ? '0px' : '-12px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={13} color="#fff" />}
          </div>
        )}
      </div>
      <img src={item.photoUrl} alt={item.name} style={styles.thumbnail} />
      <div style={styles.rowContent}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={styles.rowPrimary}>{item.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            {[...Array(item.starRating)].map((_, i) => (
              <Star key={i} size={12} fill="#fbbf24" color="#fbbf24" />
            ))}
          </span>
        </div>
        <div style={styles.rowSecondary}>
          <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle', flexShrink: 0 }} />
          {item.address}
          <span style={{ color: '#9ca3af', marginLeft: '8px' }}>· {distanceText}</span>
        </div>
        <div style={{ 
          fontSize: '14px',
          fontWeight: '400',
          color: '#9ca3af',
          marginTop: '6px',
          lineHeight: '1.5',
          whiteSpace: 'normal', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden' 
        }}>
          {item.notes}
        </div>
      </div>
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
          visibility: mode === 'default' ? 'visible' : 'hidden',
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, item.name);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const FaqRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
        cursor: mode === 'reorder' ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        marginRight: showLeadingAction ? '0px' : '-12px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={13} color="#fff" />}
          </div>
        )}
      </div>
      <div style={styles.rowContent}>
        <div style={styles.rowPrimary}>{item.question}</div>
        <div style={{ ...styles.rowSecondary, whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.answer}
        </div>
      </div>
      {item.category && <span style={{ ...styles.pill, transition: 'opacity 0.2s ease', opacity: mode === 'default' ? 1 : 0.5 }}>{item.category}</span>}
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
          visibility: mode === 'default' ? 'visible' : 'hidden',
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, item.question);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const TravelRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  // Travel type configuration with emojis and colors
  const travelTypes = {
    airport: { label: 'Airport', emoji: '✈️', color: '#0ea5e9', bg: '#f0f9ff' },
    transit: { label: 'Transit', emoji: '🚇', color: '#8b5cf6', bg: '#f5f3ff' },
    rideshare: { label: 'Rideshare', emoji: '🚗', color: '#10b981', bg: '#ecfdf5' },
    taxi: { label: 'Taxi', emoji: '🚕', color: '#f59e0b', bg: '#fffbeb' },
    rental: { label: 'Rental', emoji: '🔑', color: '#ec4899', bg: '#fdf2f8' },
  };
  
  const typeConfig = travelTypes[item.itemType] || travelTypes.airport;
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
        cursor: mode === 'reorder' ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        marginRight: showLeadingAction ? '0px' : '-12px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={13} color="#fff" />}
          </div>
        )}
      </div>
      <div style={{ ...styles.timeBlock, background: typeConfig.bg, minWidth: '80px' }}>
        <span style={{ fontSize: '20px', marginBottom: '2px' }}>{typeConfig.emoji}</span>
        <span style={{ fontSize: '11px', color: typeConfig.color, fontWeight: '500' }}>{typeConfig.label}</span>
      </div>
      <div style={styles.rowContent}>
        <div style={styles.rowPrimary}>{item.title}</div>
        <div style={styles.rowSecondary}>{item.notes}</div>
        {item.phone && <div style={styles.rowTertiary}>{item.phone}</div>}
      </div>
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
          visibility: mode === 'default' ? 'visible' : 'hidden',
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, item.title);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const AttractionRow = ({ item, mode, isSelected, onSelect, onDelete, onRequestDelete, onClick, listeners }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLeadingAction = mode === 'reorder' || mode === 'multiselect';
  
  return (
    <div
      style={{
        ...styles.row,
        ...(isHovered && mode === 'default' ? styles.rowHover : {}),
        ...(isSelected ? styles.rowSelected : {}),
        cursor: mode === 'reorder' ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'multiselect') onSelect(item.id);
        else if (mode === 'default') onClick(item);
      }}
    >
      <div style={{
        ...styles.rowLeadingAction,
        width: showLeadingAction ? '32px' : '0px',
        marginRight: showLeadingAction ? '0px' : '-12px',
        opacity: showLeadingAction ? 1 : 0,
      }}>
        {mode === 'reorder' ? (
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={18} />
          </div>
        ) : (
          <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxChecked : {}) }}>
            {isSelected && <Check size={13} color="#fff" />}
          </div>
        )}
      </div>
      <img src={item.photoUrl} alt={item.name} style={styles.thumbnail} />
      <div style={styles.rowContent}>
        <div style={styles.rowPrimary}>{item.name}</div>
        <div style={styles.rowSecondary}>{item.category} · {item.location}</div>
        <div style={styles.rowTertiary}>{item.description?.substring(0, 60)}...</div>
      </div>
      {item.groupLabel && <span style={{ ...styles.pill, transition: 'opacity 0.2s ease', opacity: mode === 'default' ? 1 : 0.5 }}>{item.groupLabel}</span>}
      <button
        className="btn-icon"
        style={{ 
          ...styles.deleteButton, 
          ...(isHovered && mode === 'default' ? styles.deleteButtonVisible : {}),
          visibility: mode === 'default' ? 'visible' : 'hidden',
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          onRequestDelete(item.id, item.name);
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

// Sample guest tags for the prototype
// All available guest tags in the system
const GUEST_TAGS = [
  { id: 'vip', label: 'VIP', emoji: '⭐' },
  { id: 'speaker', label: 'Speaker', emoji: '🎤' },
  { id: 'sponsor', label: 'Sponsor', emoji: '💎' },
  { id: 'press', label: 'Press', emoji: '📰' },
  { id: 'staff', label: 'Staff', emoji: '👔' },
  { id: 'volunteer', label: 'Volunteer', emoji: '🙋' },
  { id: 'partner', label: 'Partner', emoji: '🤝' },
  { id: 'executive', label: 'Executive', emoji: '👑' },
  { id: 'attendee', label: 'Attendee', emoji: '🎫' },
  { id: 'exhibitor', label: 'Exhibitor', emoji: '🏪' },
  { id: 'media', label: 'Media', emoji: '📷' },
  { id: 'investor', label: 'Investor', emoji: '💰' },
  { id: 'board', label: 'Board Member', emoji: '📋' },
  { id: 'alumni', label: 'Alumni', emoji: '🎓' },
  { id: 'vendor', label: 'Vendor', emoji: '🛒' },
  { id: 'guest', label: 'Guest', emoji: '👤' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'student', label: 'Student', emoji: '📚' },
];

// Simulated "recently used" tags (in real app, this would come from usage data)
const RECENT_TAG_IDS = ['vip', 'speaker', 'sponsor', 'staff', 'executive'];

const ScheduleModal = ({ item, onSave, onClose, onDelete, people = [], onUpdatePeople }) => {
  const defaultForm = {
    name: '', description: '', eventMode: 'in-person',
    dateTime: { start: '', end: '', timeZone: 'America/New_York' },
    privacy: { visibility: 'public', allowedTags: [], allowedPeople: [] },
    inPerson: { venue: '', address: '', dressCode: '' }
  };
  
  // Merge item with defaults to ensure all nested properties exist
  const [form, setForm] = useState(item ? {
    ...defaultForm,
    ...item,
    dateTime: { ...defaultForm.dateTime, ...item.dateTime },
    privacy: { ...defaultForm.privacy, ...item.privacy },
    inPerson: { ...defaultForm.inPerson, ...item.inPerson },
  } : defaultForm);
  const [showSpeakerPicker, setShowSpeakerPicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  
  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm({ ...form, [parent]: { ...form[parent], [child]: value } });
    } else {
      setForm({ ...form, [field]: value });
    }
  };
  
  // Toggle a tag for private visibility
  const toggleTag = (tagId) => {
    const currentTags = form.privacy.allowedTags || [];
    const newTags = currentTags.includes(tagId) 
      ? currentTags.filter(t => t !== tagId)
      : [...currentTags, tagId];
    setForm({ ...form, privacy: { ...form.privacy, allowedTags: newTags } });
  };
  
  // Toggle a specific person for private visibility
  const toggleAllowedPerson = (personId) => {
    const currentPeople = form.privacy.allowedPeople || [];
    const newPeople = currentPeople.includes(personId)
      ? currentPeople.filter(p => p !== personId)
      : [...currentPeople, personId];
    setForm({ ...form, privacy: { ...form.privacy, allowedPeople: newPeople } });
  };
  
  // Get allowed people objects
  const getAllowedPeople = () => {
    return people.filter(p => (form.privacy.allowedPeople || []).includes(p.id));
  };

  // Find people linked to this session (only for existing items)
  const linkedPeople = item ? people.filter(p => (p.sessionIds || []).includes(item.id)) : [];
  
  // Toggle a speaker's link to this session
  const toggleSpeaker = (personId) => {
    if (!item || !onUpdatePeople) return;
    const updatedPeople = people.map(person => {
      if (person.id === personId) {
        const currentSessions = person.sessionIds || [];
        if (currentSessions.includes(item.id)) {
          return { ...person, sessionIds: currentSessions.filter(id => id !== item.id) };
        } else {
          return { ...person, sessionIds: [...currentSessions, item.id] };
        }
      }
      return person;
    });
    onUpdatePeople(updatedPeople);
  };
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" style={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{item ? 'Edit Schedule Item' : 'Add Schedule Item'}</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input style={styles.input} value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Session name" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Brief description" />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Time</label>
              <input style={styles.input} type="datetime-local" value={form.dateTime.start?.slice(0, 16)} onChange={(e) => handleChange('dateTime.start', e.target.value + ':00')} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>End Time</label>
              <input style={styles.input} type="datetime-local" value={form.dateTime.end?.slice(0, 16)} onChange={(e) => handleChange('dateTime.end', e.target.value + ':00')} />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Event Mode</label>
            <SegmentedControl
              value={form.eventMode}
              onChange={(v) => handleChange('eventMode', v)}
              options={[
                { value: 'in-person', label: '🏢 In Person' },
                { value: 'virtual', label: '💻 Virtual' },
                { value: 'hybrid', label: '🔄 Hybrid' },
              ]}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Visibility</label>
            <SegmentedControl
              value={form.privacy.visibility}
              onChange={(v) => handleChange('privacy.visibility', v)}
              options={[
                { value: 'public', label: '🌐 Public' },
                { value: 'private', label: '🔒 Private' },
              ]}
            />
          </div>
          
          {/* Private Event Configuration */}
          {form.privacy.visibility === 'private' && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: '1.5' }}>
                Choose who can see this event. Select guest tags or specific people.
              </div>
              
              {/* Tags Section */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#475569', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>Guests with these tags</span>
                  <button
                    type="button"
                    onClick={() => setShowTagPicker(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Browse all
                  </button>
                </div>
                
                {/* Show selected tags that aren't in recent */}
                {(form.privacy.allowedTags || []).filter(id => !RECENT_TAG_IDS.includes(id)).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    {(form.privacy.allowedTags || [])
                      .filter(id => !RECENT_TAG_IDS.includes(id))
                      .map(tagId => {
                        const tag = GUEST_TAGS.find(t => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <div
                            key={tag.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 10px',
                              borderRadius: '16px',
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: '#1d4ed8',
                              fontSize: '12px',
                            }}
                          >
                            <span>{tag.emoji}</span>
                            <span>{tag.label}</span>
                            <button
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                cursor: 'pointer',
                                color: '#3b82f6',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
                
                {/* Recent/Quick tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {RECENT_TAG_IDS.map(tagId => {
                    const tag = GUEST_TAGS.find(t => t.id === tagId);
                    if (!tag) return null;
                    const isSelected = (form.privacy.allowedTags || []).includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '20px',
                          border: isSelected ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#fff',
                          color: isSelected ? '#1d4ed8' : '#475569',
                          fontSize: '12px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>{tag.emoji}</span>
                        <span>{tag.label}</span>
                        {isSelected && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Specific People Section */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#475569', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>Specific people</span>
                  <button
                    type="button"
                    onClick={() => setShowGuestPicker(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>
                
                {getAllowedPeople().length === 0 ? (
                  <div style={{ 
                    padding: '12px', 
                    background: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    color: '#94a3b8',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}>
                    No specific people added
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    padding: '12px',
                  }}>
                    {getAllowedPeople().map(person => (
                      <div
                        key={person.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 10px 6px 6px',
                          background: '#f1f5f9',
                          borderRadius: '20px',
                          fontSize: '12px',
                          color: '#334155',
                        }}
                      >
                        {person.photoUrl ? (
                          <img 
                            src={person.photoUrl} 
                            alt=""
                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            background: '#cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#64748b',
                          }}>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </div>
                        )}
                        <span>{person.firstName} {person.lastName}</span>
                        <button
                          type="button"
                          onClick={() => toggleAllowedPerson(person.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '2px',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Summary */}
              {((form.privacy.allowedTags || []).length > 0 || (form.privacy.allowedPeople || []).length > 0) && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '16px' }}>👁️</span>
                  <span>
                    Visible to {(form.privacy.allowedTags || []).length > 0 && (
                      <strong style={{ color: '#334155' }}>
                        {(form.privacy.allowedTags || []).map(id => GUEST_TAGS.find(t => t.id === id)?.label).join(', ')}
                      </strong>
                    )}
                    {(form.privacy.allowedTags || []).length > 0 && (form.privacy.allowedPeople || []).length > 0 && ' and '}
                    {(form.privacy.allowedPeople || []).length > 0 && (
                      <strong style={{ color: '#334155' }}>
                        {(form.privacy.allowedPeople || []).length} specific {(form.privacy.allowedPeople || []).length === 1 ? 'person' : 'people'}
                      </strong>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Venue</label>
            <input style={styles.input} value={form.inPerson?.venue || ''} onChange={(e) => handleChange('inPerson.venue', e.target.value)} placeholder="Venue name" />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <input style={styles.input} value={form.inPerson?.address || ''} onChange={(e) => handleChange('inPerson.address', e.target.value)} placeholder="Address" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Dress Code</label>
              <input style={styles.input} value={form.inPerson?.dressCode || ''} onChange={(e) => handleChange('inPerson.dressCode', e.target.value)} placeholder="e.g. Business Casual" />
            </div>
          </div>

          {/* Linked Speakers Section - only show for existing sessions */}
          {item && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Speakers & Presenters</label>
              <div style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '10px', 
                overflow: 'hidden',
                background: '#fafafa'
              }}>
                {linkedPeople.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#71717a', fontSize: '14px' }}>
                    No speakers linked yet
                  </div>
                ) : (
                  <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {linkedPeople.map(person => (
                      <div key={person.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        background: '#fff',
                        borderBottom: '1px solid #e5e7eb',
                      }}>
                        {person.photoUrl ? (
                          <img 
                            src={person.photoUrl} 
                            alt={`${person.firstName} ${person.lastName}`}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: '500' }}>
                            {person.firstName?.[0]}{person.lastName?.[0]}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '400', color: '#1D1D1F' }}>
                            {person.firstName} {person.lastName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#71717a' }}>
                            {person.title}{person.company && ` · ${person.company}`}
                          </div>
                        </div>
                        {person.roleTypes?.[0] && (
                          <span style={{ ...styles.pill, fontSize: '10px' }}>{person.roleTypes[0]}</span>
                        )}
                        <button
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            padding: '4px', 
                            cursor: 'pointer',
                            color: '#a1a1aa',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '4px',
                          }}
                          onClick={() => toggleSpeaker(person.id)}
                          title="Remove speaker"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#fff',
                    border: 'none',
                    borderTop: linkedPeople.length > 0 ? 'none' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#1D1D1F',
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                  onClick={() => setShowSpeakerPicker(true)}
                >
                  <Plus size={16} />
                  {linkedPeople.length === 0 ? 'Add Speakers' : 'Add More Speakers'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={styles.modalFooter}>
          {item && <button className="btn-danger" style={styles.dangerButton} onClick={() => onDelete(item.id)}>Delete</button>}
          {!item && <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={styles.modeButton} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={styles.primaryButton} onClick={() => onSave({ ...form, id: form.id || generateId('sch') })}>Save</button>
          </div>
        </div>
      </div>
      
      {/* Speaker Picker Modal */}
      {showSpeakerPicker && (
        <div style={{ ...styles.modalOverlay, background: 'rgba(0,0,0,0.2)' }} onClick={() => setShowSpeakerPicker(false)}>
          <div style={{ ...styles.modal, maxWidth: '500px', maxHeight: '70vh' }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" style={styles.modalClose} onClick={() => setShowSpeakerPicker(false)}><X size={18} /></button>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Select Speakers</h2>
            </div>
            <div style={{ padding: '0', maxHeight: '50vh', overflow: 'auto' }}>
              {people.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#71717a' }}>
                  No people available
                </div>
              ) : (
                people.map(person => {
                  const isSelected = (person.sessionIds || []).includes(item.id);
                  return (
                    <div
                      key={person.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e5e7eb',
                        background: isSelected ? '#f0f9ff' : '#fff',
                        transition: 'background 0.1s',
                      }}
                      onClick={() => toggleSpeaker(person.id)}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        border: isSelected ? 'none' : '1.5px solid #d1d5db',
                        background: isSelected ? '#3b82f6' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isSelected && <Check size={13} color="#fff" />}
                      </div>
                      {person.photoUrl ? (
                        <img 
                          src={person.photoUrl} 
                          alt={`${person.firstName} ${person.lastName}`}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: '500' }}>
                          {person.firstName?.[0]}{person.lastName?.[0]}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '400', color: '#1D1D1F' }}>
                          {person.firstName} {person.lastName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#71717a' }}>
                          {person.title}{person.company && ` · ${person.company}`}
                        </div>
                      </div>
                      {person.roleTypes?.[0] && (
                        <span style={{ ...styles.pill, fontSize: '10px' }}>{person.roleTypes[0]}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ ...styles.modalFooter, justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={styles.primaryButton} onClick={() => setShowSpeakerPicker(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Guest Picker Modal for Private Events */}
      {showGuestPicker && (
        <div style={{ ...styles.modalOverlay, background: 'rgba(0,0,0,0.2)' }} onClick={() => setShowGuestPicker(false)}>
          <div style={{ ...styles.modal, maxWidth: '500px', maxHeight: '70vh' }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" style={styles.modalClose} onClick={() => setShowGuestPicker(false)}><X size={18} /></button>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add People</h2>
            </div>
            <div style={{ padding: '16px 0 0', fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
              Select specific people who can see this private event
            </div>
            <div style={{ padding: '0', maxHeight: '50vh', overflow: 'auto' }}>
              {people.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#71717a' }}>
                  No people available
                </div>
              ) : (
                people.map(person => {
                  const isSelected = (form.privacy.allowedPeople || []).includes(person.id);
                  return (
                    <div
                      key={person.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 24px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#f0f9ff' : '#fff',
                        transition: 'background 0.1s',
                      }}
                      onClick={() => toggleAllowedPerson(person.id)}
                    >
                      {person.photoUrl ? (
                        <img 
                          src={person.photoUrl} 
                          alt={`${person.firstName} ${person.lastName}`}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                          {person.firstName?.[0]}{person.lastName?.[0]}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: '400', color: '#1D1D1F' }}>
                          {person.firstName} {person.lastName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#71717a' }}>
                          {person.title}{person.company && ` · ${person.company}`}
                        </div>
                      </div>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '5px',
                        border: isSelected ? 'none' : '1.5px solid #d1d5db',
                        background: isSelected ? '#3b82f6' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}>
                        {isSelected && <Check size={13} color="#fff" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ ...styles.modalFooter, justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={styles.primaryButton} onClick={() => setShowGuestPicker(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tag Picker Modal */}
      {showTagPicker && (
        <div style={{ ...styles.modalOverlay, background: 'rgba(0,0,0,0.2)' }} onClick={() => { setShowTagPicker(false); setTagSearch(''); }}>
          <div style={{ ...styles.modal, maxWidth: '480px', maxHeight: '70vh' }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" style={styles.modalClose} onClick={() => { setShowTagPicker(false); setTagSearch(''); }}><X size={18} /></button>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Browse Tags</h2>
            </div>
            <div style={{ padding: '0 24px 16px' }}>
              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                style={{
                  ...styles.input,
                  width: '100%',
                }}
                autoFocus
              />
            </div>
            <div style={{ padding: '0 24px', maxHeight: '40vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingBottom: '16px' }}>
                {GUEST_TAGS
                  .filter(tag => 
                    tag.label.toLowerCase().includes(tagSearch.toLowerCase()) ||
                    tag.id.toLowerCase().includes(tagSearch.toLowerCase())
                  )
                  .map(tag => {
                    const isSelected = (form.privacy.allowedTags || []).includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 16px',
                          borderRadius: '20px',
                          border: isSelected ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#fff',
                          color: isSelected ? '#1d4ed8' : '#475569',
                          fontSize: '14px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{tag.emoji}</span>
                        <span>{tag.label}</span>
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                {GUEST_TAGS.filter(tag => 
                  tag.label.toLowerCase().includes(tagSearch.toLowerCase()) ||
                  tag.id.toLowerCase().includes(tagSearch.toLowerCase())
                ).length === 0 && (
                  <div style={{ padding: '20px', color: '#94a3b8', fontSize: '14px', textAlign: 'center', width: '100%' }}>
                    No tags match "{tagSearch}"
                  </div>
                )}
              </div>
            </div>
            <div style={{ ...styles.modalFooter, justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {(form.privacy.allowedTags || []).length} tag{(form.privacy.allowedTags || []).length !== 1 ? 's' : ''} selected
              </div>
              <button className="btn-primary" style={styles.primaryButton} onClick={() => { setShowTagPicker(false); setTagSearch(''); }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PersonModal = ({ item, onSave, onClose, onDelete, schedule = [] }) => {
  const [form, setForm] = useState(item || {
    firstName: '', lastName: '', title: '', company: '', bio: '', photoUrl: '', roleTypes: [], links: [], sessionIds: []
  });
  const [showSessionPicker, setShowSessionPicker] = useState(false);

  const toggleSession = (sessionId) => {
    const currentSessions = form.sessionIds || [];
    if (currentSessions.includes(sessionId)) {
      setForm({ ...form, sessionIds: currentSessions.filter(id => id !== sessionId) });
    } else {
      setForm({ ...form, sessionIds: [...currentSessions, sessionId] });
    }
  };

  const getLinkedSessions = () => {
    return schedule.filter(s => (form.sessionIds || []).includes(s.id));
  };

  const formatSessionTime = (session) => {
    const date = new Date(session.dateTime.start);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + 
           ' · ' + formatTime(session.dateTime.start);
  };
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" style={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{item ? 'Edit Person' : 'Add Person'}</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input style={styles.input} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input style={styles.input} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Company</label>
              <input style={styles.input} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Photo</label>
            <ImageUrlInput 
              value={form.photoUrl} 
              onChange={(v) => setForm({ ...form, photoUrl: v })} 
              placeholder="Paste profile photo URL..."
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <SegmentedControl
              value={form.roleTypes[0] || ''}
              onChange={(v) => setForm({ ...form, roleTypes: v ? [v] : [] })}
              options={[
                { value: 'speaker', label: 'Speaker' },
                { value: 'panelist', label: 'Panelist' },
                { value: 'vip', label: 'VIP' },
                { value: 'host', label: 'Host' },
              ]}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Bio</label>
            <textarea style={styles.textarea} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Brief background and expertise..." />
          </div>
          
          {/* Sessions Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Linked Sessions</label>
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              overflow: 'hidden',
              background: '#fafafa'
            }}>
              {getLinkedSessions().length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#71717a', fontSize: '14px' }}>
                  No sessions linked yet
                </div>
              ) : (
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                  {getLinkedSessions().map(session => (
                    <div key={session.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#fff',
                      borderBottom: '1px solid #e5e7eb',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '400', color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {session.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#71717a' }}>
                          {formatSessionTime(session)}
                        </div>
                      </div>
                      <button
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          padding: '4px', 
                          cursor: 'pointer',
                          color: '#a1a1aa',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px',
                        }}
                        onClick={() => toggleSession(session.id)}
                        title="Remove link"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#fff',
                  border: 'none',
                  borderTop: getLinkedSessions().length > 0 ? 'none' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1D1D1F',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                onClick={() => setShowSessionPicker(true)}
              >
                <Plus size={16} />
                {getLinkedSessions().length === 0 ? 'Link to Sessions' : 'Add More Sessions'}
              </button>
            </div>
          </div>
        </div>
        <div style={styles.modalFooter}>
          {item && <button className="btn-danger" style={styles.dangerButton} onClick={() => onDelete(item.id)}>Delete</button>}
          {!item && <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={styles.modeButton} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={styles.primaryButton} onClick={() => onSave({ ...form, id: form.id || generateId('ppl') })}>Save</button>
          </div>
        </div>
      </div>

      {/* Session Picker Modal */}
      {showSessionPicker && (
        <div style={{ ...styles.modalOverlay, background: 'rgba(0,0,0,0.2)' }} onClick={() => setShowSessionPicker(false)}>
          <div style={{ ...styles.modal, maxWidth: '500px', maxHeight: '70vh' }} onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" style={styles.modalClose} onClick={() => setShowSessionPicker(false)}><X size={18} /></button>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Select Sessions</h2>
            </div>
            <div style={{ padding: '0', maxHeight: '50vh', overflow: 'auto' }}>
              {schedule.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#71717a' }}>
                  No schedule items available
                </div>
              ) : (
                schedule.map(session => {
                  const isSelected = (form.sessionIds || []).includes(session.id);
                  return (
                    <div
                      key={session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e5e7eb',
                        background: isSelected ? '#f0f9ff' : '#fff',
                        transition: 'background 0.1s',
                      }}
                      onClick={() => toggleSession(session.id)}
                    >
                      <div style={{ 
                        ...styles.checkbox, 
                        ...(isSelected ? styles.checkboxChecked : {}),
                        flexShrink: 0,
                      }}>
                        {isSelected && <Check size={13} color="#fff" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '400', color: '#1D1D1F' }}>
                          {session.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px' }}>
                          {formatSessionTime(session)}
                          {session.inPerson?.venue && ` · ${session.inPerson.venue}`}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div style={{ ...styles.modalFooter, justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={styles.primaryButton} onClick={() => setShowSessionPicker(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HotelModal = ({ item, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState(item || {
    name: '', notes: '', photoUrl: '', starRating: 3, distanceKm: 0, address: '', url: ''
  });
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" style={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{item ? 'Edit Hotel' : 'Add Hotel'}</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Photo</label>
            <ImageUrlInput 
              value={form.photoUrl} 
              onChange={(v) => setForm({ ...form, photoUrl: v })} 
              placeholder="Paste hotel image URL..."
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Hotel Name</label>
            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. The Grand Hotel" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Star Rating</label>
            <StarRatingInput 
              value={form.starRating} 
              onChange={(v) => setForm({ ...form, starRating: v })} 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Distance from Venue</label>
            <DistanceInput 
              value={form.distanceKm} 
              onChange={(v) => setForm({ ...form, distanceKm: v })}
              unit="km"
              max={5}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input 
              style={{ ...styles.input, paddingLeft: '40px' }} 
              value={form.address} 
              onChange={(e) => setForm({ ...form, address: e.target.value })} 
              placeholder="Street address, City"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <UrlInput 
              value={form.url} 
              onChange={(v) => setForm({ ...form, url: v })} 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Why recommend this hotel?</label>
            <textarea style={styles.textarea} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Special rates, amenities, proximity..." />
          </div>
        </div>
        <div style={styles.modalFooter}>
          {item && <button className="btn-danger" style={styles.dangerButton} onClick={() => onDelete(item.id)}>Delete</button>}
          {!item && <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={styles.modeButton} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={styles.primaryButton} onClick={() => onSave({ ...form, id: form.id || generateId('htl') })}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FaqModal = ({ item, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState(item || { question: '', answer: '', category: '' });
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" style={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{item ? 'Edit FAQ' : 'Add FAQ'}</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Question</label>
            <input style={styles.input} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="What do attendees ask?" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Answer</label>
            <textarea style={{ ...styles.textarea, minHeight: '140px' }} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Provide a helpful answer..." />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category (optional)</label>
            <input style={styles.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Logistics, Food, General" />
          </div>
        </div>
        <div style={styles.modalFooter}>
          {item && <button className="btn-danger" style={styles.dangerButton} onClick={() => onDelete(item.id)}>Delete</button>}
          {!item && <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={styles.modeButton} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={styles.primaryButton} onClick={() => onSave({ ...form, id: form.id || generateId('faq') })}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TravelModal = ({ item, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState(item || { itemType: 'airport', title: '', notes: '', phone: '', links: [] });
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" style={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{item ? 'Edit Travel Info' : 'Add Travel Info'}</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Type</label>
            <SegmentedControl
              value={form.itemType}
              onChange={(v) => setForm({ ...form, itemType: v })}
              options={[
                { value: 'airport', label: '✈️ Airport' },
                { value: 'transit', label: '🚇 Transit' },
                { value: 'rideshare', label: '🚗 Rideshare' },
                { value: 'taxi', label: '🚕 Taxi' },
                { value: 'rental', label: '🚙 Rental' },
              ]}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. San Francisco International Airport" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contact Phone</label>
            <PhoneInput 
              value={form.phone} 
              onChange={(v) => setForm({ ...form, phone: v })} 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Helpful Details</label>
            <textarea style={styles.textarea} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Distance, costs, tips for attendees..." />
          </div>
        </div>
        <div style={styles.modalFooter}>
          {item && <button className="btn-danger" style={styles.dangerButton} onClick={() => onDelete(item.id)}>Delete</button>}
          {!item && <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={styles.modeButton} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={styles.primaryButton} onClick={() => onSave({ ...form, id: form.id || generateId('trv') })}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttractionModal = ({ item, onSave, onClose, onDelete }) => {
  const [form, setForm] = useState(item || { name: '', category: '', description: '', photoUrl: '', location: '', link: '', groupLabel: '' });
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" style={styles.modalClose} onClick={onClose}><X size={18} /></button>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{item ? 'Edit Attraction' : 'Add Attraction'}</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Photo</label>
            <ImageUrlInput 
              value={form.photoUrl} 
              onChange={(v) => setForm({ ...form, photoUrl: v })} 
              placeholder="Paste attraction image URL..."
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Golden Gate Bridge" />
          </div>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select style={styles.select} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select type</option>
                <option value="Landmark">🏛️ Landmark</option>
                <option value="Restaurant">🍽️ Restaurant</option>
                <option value="Museum">🎨 Museum</option>
                <option value="Park">🌳 Park</option>
                <option value="Entertainment">🎭 Entertainment</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Neighborhood">🏘️ Neighborhood</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>List Under</label>
              <select style={styles.select} value={form.groupLabel} onChange={(e) => setForm({ ...form, groupLabel: e.target.value })}>
                <option value="">No grouping</option>
                <option value="Must See">⭐ Must See</option>
                <option value="Local Favorites">❤️ Local Favorites</option>
                <option value="Explore">🧭 Explore</option>
                <option value="Culture">🎭 Culture</option>
              </select>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input 
              style={styles.input} 
              value={form.location} 
              onChange={(e) => setForm({ ...form, location: e.target.value })} 
              placeholder="Neighborhood or address"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Why visit?</label>
            <textarea style={styles.textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What makes this place special..." />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Website</label>
            <UrlInput 
              value={form.link} 
              onChange={(v) => setForm({ ...form, link: v })} 
            />
          </div>
        </div>
        <div style={styles.modalFooter}>
          {item && <button className="btn-danger" style={styles.dangerButton} onClick={() => onDelete(item.id)}>Delete</button>}
          {!item && <div />}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={styles.modeButton} onClick={onClose}>Cancel</button>
            <button className="btn-primary" style={styles.primaryButton} onClick={() => onSave({ ...form, id: form.id || generateId('att') })}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CONFIRM DIALOG COMPONENT
// ============================================================================

const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirm Delete', 
  message = 'Are you sure you want to delete this item?', 
  confirmLabel = 'Delete', 
  cancelLabel = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'default'
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;
  
  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div 
        style={{ 
          ...styles.modal, 
          maxWidth: '380px',
          animation: 'slideUp 0.2s ease-out',
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '32px 32px 24px', textAlign: 'center' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '17px', 
            fontWeight: '600', 
            color: '#1D1D1F',
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '15px', 
            color: '#86868b',
            lineHeight: '1.5',
            letterSpacing: '-0.01em',
          }}>
            {message}
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '0 32px 32px',
        }}>
          <button 
            className="btn-outline" 
            style={{
              ...styles.modeButton,
              flex: 1,
              justifyContent: 'center',
              background: '#f5f5f7',
              border: 'none',
            }} 
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button 
            className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
            style={{
              ...(variant === 'danger' ? styles.dangerButton : styles.primaryButton),
              flex: 1,
              justifyContent: 'center',
              ...(variant === 'danger' ? { background: '#ff3b30', border: 'none' } : {}),
            }} 
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UNIVERSAL LIST EDITOR
// ============================================================================

const UniversalListEditor = ({ title, items, setItems, RowComponent, ModalComponent, emptyTitle, emptyText, addLabel, modalProps = {}, rowProps = {}, onDeleteCheck, groupBy, maxWidth }) => {
  const [mode, setMode] = useState('default');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Delete',
    variant: 'danger',
    onConfirm: null,
  });
  
  // Lock body scroll when modal is open
  React.useEffect(() => {
    const isModalOpen = editingItem || isAdding || confirmDialog.isOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [editingItem, isAdding, confirmDialog.isOpen]);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };
  
  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };
  
  const selectAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((item) => item.id)));
  };
  
  // Show custom confirm dialog
  const showConfirmDialog = ({ title, message, confirmLabel = 'Delete', variant = 'danger', onConfirm }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmLabel,
      variant,
      onConfirm,
    });
  };
  
  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };
  
  const handleConfirmDialogConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    closeConfirmDialog();
  };
  
  // Request confirmation for row deletion (passed to rows via rowProps)
  const requestDeleteConfirm = (id, itemName) => {
    showConfirmDialog({
      title: 'Delete Item',
      message: itemName 
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => handleDelete(id),
    });
  };
  
  const deleteSelected = () => {
    const count = selectedIds.size;
    showConfirmDialog({
      title: `Delete ${count} ${count === 1 ? 'Item' : 'Items'}`,
      message: `Are you sure you want to delete ${count} selected ${count === 1 ? 'item' : 'items'}? This action cannot be undone.`,
      confirmLabel: `Delete ${count} ${count === 1 ? 'Item' : 'Items'}`,
      variant: 'danger',
      onConfirm: () => {
        setItems(items.filter((item) => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
        setMode('default');
      },
    });
  };
  
  const handleDelete = (id) => {
    // If there's a delete check function, use it (for confirming deletions with linked items)
    if (onDeleteCheck) {
      const shouldDelete = onDeleteCheck(id);
      if (!shouldDelete) return;
    }
    setItems(items.filter((item) => item.id !== id));
    setEditingItem(null);
  };
  
  const handleSave = (item) => {
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      const newItems = [...items];
      newItems[index] = item;
      setItems(newItems);
    } else {
      setItems([...items, item]);
    }
    setEditingItem(null);
    setIsAdding(false);
  };
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (editingItem || isAdding) {
        setEditingItem(null);
        setIsAdding(false);
      } else if (mode !== 'default') {
        setMode('default');
        setSelectedIds(new Set());
      }
    }
    if (mode === 'multiselect' && (e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      selectAll();
    }
  }, [mode, editingItem, isAdding, items]);
  
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const exitMode = () => {
    setMode('default');
    setSelectedIds(new Set());
  };

  return (
    <div style={{ maxWidth: maxWidth || '100%', margin: '0 auto' }}>
      {/* Default mode header */}
      {mode === 'default' && (
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="btn-ghost"
              style={styles.ghostButton}
              onClick={() => { setMode('multiselect'); setSelectedIds(new Set()); }}
            >
              Select...
            </button>
            <button
              className="btn-ghost"
              style={styles.ghostButton}
              onClick={() => { setMode('reorder'); setSelectedIds(new Set()); }}
            >
              Reorder
            </button>
          </div>
          <button className="btn-outline" style={styles.modeButton} onClick={() => setIsAdding(true)}>
            <Plus size={16} />
            {addLabel}
          </button>
        </div>
      )}

      {/* Reorder mode header */}
      {mode === 'reorder' && (
        <div style={styles.header}>
          <span style={{ fontSize: '14px', color: '#9ca3af' }}>
            Drag items to reorder
          </span>
          <button className="btn-outline" style={styles.modeButton} onClick={exitMode}>
            Done
          </button>
        </div>
      )}

      {/* Multi-select mode header */}
      {mode === 'multiselect' && (
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-ghost"
              style={styles.ghostButton}
              onClick={selectAll}
            >
              {selectedIds.size === items.length && items.length > 0 ? 'Deselect All' : 'Select All'}
            </button>
            {selectedIds.size > 0 && (
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                {selectedIds.size} selected
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedIds.size > 0 && (
              <button className="btn-danger" style={styles.dangerButton} onClick={deleteSelected}>
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button className="btn-outline" style={styles.modeButton} onClick={exitMode}>
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {items.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyTitle}>{emptyTitle}</div>
          <div style={styles.emptyText}>{emptyText}</div>
          <button className="btn-outline" style={styles.modeButton} onClick={() => setIsAdding(true)}>
            <Plus size={16} />
            {addLabel}
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy} disabled={mode !== 'reorder'}>
            <div style={styles.list}>
              {items.map((item, index) => {
                // Compute group header if groupBy is provided
                let showHeader = false;
                let groupLabel = null;
                let isFirstHeader = false;
                if (groupBy) {
                  const currentGroup = groupBy(item);
                  const prevGroup = index > 0 ? groupBy(items[index - 1]) : null;
                  if (currentGroup && (!prevGroup || currentGroup.key !== prevGroup.key)) {
                    showHeader = true;
                    groupLabel = currentGroup.label;
                    isFirstHeader = index === 0;
                  }
                }
                
                return (
                  <React.Fragment key={item.id}>
                    {showHeader && (
                      <div style={{
                        ...styles.sectionHeader,
                        ...(isFirstHeader ? { borderTop: 'none' } : {}),
                        ...(mode === 'reorder' ? { pointerEvents: 'none', opacity: 0.5 } : {})
                      }}>
                        {groupLabel}
                      </div>
                    )}
                    <SortableRow id={item.id} mode={mode} isSelected={selectedIds.has(item.id)}>
                      {({ listeners, isDragging }) => (
                        <RowComponent
                          item={item}
                          mode={mode}
                          isSelected={selectedIds.has(item.id)}
                          onSelect={toggleSelect}
                          onDelete={handleDelete}
                          onRequestDelete={requestDeleteConfirm}
                          onClick={setEditingItem}
                          listeners={listeners}
                          {...rowProps}
                        />
                      )}
                    </SortableRow>
                  </React.Fragment>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
      
      {(editingItem || isAdding) && (
        <ModalComponent
          item={isAdding ? null : editingItem}
          onSave={handleSave}
          onClose={() => { setEditingItem(null); setIsAdding(false); }}
          onDelete={handleDelete}
          {...modalProps}
        />
      )}
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={handleConfirmDialogConfirm}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

const contentTypes = [
  { key: 'schedule', label: 'Schedule', icon: Clock },
  { key: 'people', label: 'People', icon: User },
  { key: 'hotels', label: 'Hotels', icon: Star },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'travel', label: 'Travel', icon: Plane },
  { key: 'attractions', label: 'Attractions', icon: Compass },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [schedule, setSchedule] = useState(sampleSchedule);
  const [people, setPeople] = useState(samplePeople);
  const [hotels, setHotels] = useState(sampleHotels);
  const [faqs, setFaqs] = useState(sampleFaqs);
  const [travel, setTravel] = useState(sampleTravel);
  const [attractions, setAttractions] = useState(sampleAttractions);
  
  // Check if any people are linked to a schedule item before deleting
  const checkScheduleDelete = (scheduleId) => {
    const linkedPeople = people.filter(p => (p.sessionIds || []).includes(scheduleId));
    if (linkedPeople.length > 0) {
      const names = linkedPeople.map(p => `${p.firstName} ${p.lastName}`).join(', ');
      const confirmed = window.confirm(
        `This session is linked to ${linkedPeople.length} ${linkedPeople.length === 1 ? 'person' : 'people'}: ${names}.\n\nDeleting this session will remove it from their profiles. Continue?`
      );
      if (confirmed) {
        // Remove the session ID from all linked people
        setPeople(people.map(p => ({
          ...p,
          sessionIds: (p.sessionIds || []).filter(id => id !== scheduleId)
        })));
      }
      return confirmed;
    }
    return true;
  };

  // Group schedule items by date
  const groupScheduleByDate = (item) => {
    if (!item.dateTime?.start) return null;
    const date = new Date(item.dateTime.start);
    const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const label = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    return { key, label };
  };

  // Group people by role
  const groupPeopleByRole = (item) => {
    const role = item.roleTypes?.[0];
    if (!role) return { key: 'other', label: 'Other' };
    const labels = {
      speaker: 'Speakers',
      panelist: 'Panelists', 
      vip: 'VIPs',
      host: 'Hosts'
    };
    return { key: role, label: labels[role] || role };
  };

  // Group attractions by their groupLabel
  const groupAttractionsByLabel = (item) => {
    const label = item.groupLabel || 'Other';
    return { key: label, label };
  };

  const renderEditor = () => {
    switch (activeTab) {
      case 'schedule':
        // Wide: time blocks, descriptions, speaker photos
        return <UniversalListEditor title="Schedule" items={schedule} setItems={setSchedule} RowComponent={ScheduleRow} ModalComponent={ScheduleModal} emptyTitle="No schedule items yet" emptyText="Start building your event timeline" addLabel="Add Schedule Item" onDeleteCheck={checkScheduleDelete} modalProps={{ people, onUpdatePeople: setPeople }} rowProps={{ people }} groupBy={groupScheduleByDate} maxWidth="900px" />;
      case 'people':
        // Medium: avatars, names, session counts
        return <UniversalListEditor title="People" items={people} setItems={setPeople} RowComponent={PersonRow} ModalComponent={PersonModal} emptyTitle="No people added" emptyText="Add speakers, VIPs, and key attendees" addLabel="Add Person" modalProps={{ schedule }} groupBy={groupPeopleByRole} maxWidth="800px" />;
      case 'hotels':
        // Medium-wide: thumbnails, star ratings, descriptions
        return <UniversalListEditor title="Hotels" items={hotels} setItems={setHotels} RowComponent={HotelRow} ModalComponent={HotelModal} emptyTitle="No hotel recommendations yet" emptyText="Help attendees find great places to stay" addLabel="Add Hotel" maxWidth="850px" />;
      case 'faq':
        // Narrower: text-focused, better readability
        return <UniversalListEditor title="FAQ" items={faqs} setItems={setFaqs} RowComponent={FaqRow} ModalComponent={FaqModal} emptyTitle="No FAQs yet" emptyText="Answer common attendee questions" addLabel="Add FAQ" maxWidth="700px" />;
      case 'travel':
        // Medium-narrow: text-focused with badges
        return <UniversalListEditor title="Travel" items={travel} setItems={setTravel} RowComponent={TravelRow} ModalComponent={TravelModal} emptyTitle="No travel info added" emptyText="Help attendees get to your event" addLabel="Add Travel Info" maxWidth="750px" />;
      case 'attractions':
        // Medium-wide: thumbnails and descriptions
        return <UniversalListEditor title="Attractions" items={attractions} setItems={setAttractions} RowComponent={AttractionRow} ModalComponent={AttractionModal} emptyTitle="No attractions yet" emptyText="Recommend local places to explore" addLabel="Add Attraction" groupBy={groupAttractionsByLabel} maxWidth="850px" />;
      default:
        return null;
    }
  };
  
  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff; }
        input:focus, textarea:focus, select:focus { border-color: #9ca3af !important; box-shadow: 0 0 0 3px rgba(0,0,0,0.04); }
        
        /* Button transitions and active state */
        button { transition: all 0.15s ease; }
        button:active:not(:disabled) { transform: scale(0.98); }
        
        /* Ghost/link button hover - the Select.../Reorder buttons */
        .btn-ghost:hover { background: #f3f4f6 !important; color: #1D1D1F !important; }
        
        /* Primary dark button hover */
        .btn-primary:hover { background: #374151 !important; }
        
        /* Bordered/outline button hover */
        .btn-outline:hover { background: #f9fafb !important; border-color: #d1d5db !important; }
        
        /* Danger button hover */
        .btn-danger:hover { background: #fee2e2 !important; }
        
        /* Icon-only delete button hover */
        .btn-icon:hover { color: #ef4444 !important; background: #fef2f2 !important; }
        
        /* Nav button hover (inactive ones) */
        .nav-btn:hover { background: #f3f4f6 !important; color: #1D1D1F !important; }
        .nav-btn-active:hover { background: #374151 !important; }
        
        /* Modal close button */
        .btn-close:hover { background: #f0f0f0 !important; color: #1D1D1F !important; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      
      <nav style={styles.nav}>
        {contentTypes.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={activeTab === key ? 'nav-btn-active' : 'nav-btn'}
            style={{ ...styles.navButton, ...(activeTab === key ? styles.navButtonActive : styles.navButtonInactive) }}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
      
      {renderEditor()}
    </div>
  );
}
