import React, { useState } from 'react';
import './Newsletter.css';

const newsletterData = {
  november: {
    month: 'November 2025',
    events: [
      {
        id: 1,
        title: 'CF Awareness Month Activities',
        date: 'November 2025',
        description: 'Various awareness activities and campaigns throughout the month to raise awareness about Cystic Fibrosis.',
        link: 'https://www.cfri.org/events/'
      },
      {
        id: 2,
        title: 'Monthly Support Groups',
        date: 'November 2025',
        description: 'Virtual support groups for adults with CF, caregivers, and families. Multiple sessions throughout the month.',
        link: 'https://www.cfri.org/events/'
      }
    ],
    resources: [
      {
        id: 1,
        title: 'CF Community Voices Podcast Series',
        organization: 'CFRI',
        description: 'A wealth of information on scholarships, patient assistance, hemoptysis, CF and mental health, bone health, advocacy, and more.',
        link: 'https://cfri.podbean.com/',
        type: 'Podcast'
      },
      {
        id: 2,
        title: 'CFRI Conference Recordings',
        organization: 'CFRI',
        description: 'Recordings from the 38th National CF Education Conference covering various CF-related topics.',
        link: 'https://www.youtube.com/@CFRICURECF',
        type: 'Video'
      }
    ],
    research: [
      {
        id: 1,
        title: 'CF Research Funding Campaign',
        organization: 'CFRI',
        description: 'CFRI continues funding innovative research projects to find better treatments and ultimately a cure for CF.',
        link: 'https://www.cfri.org/research/',
        category: 'Funding'
      }
    ]
  },
  december: {
    month: 'December 2025',
    events: [
      {
        id: 1,
        title: 'Free Wellness Class: Flexibility/Mobility',
        date: 'January 3, 2026, 9:00 AM PT',
        description: 'CFRI\'s wellness classes for the CF community taught by Lisa Romao. Free for all abilities.',
        link: 'https://www.cfri.org/wellness-classes/'
      },
      {
        id: 2,
        title: 'Navigating Grief to Growth Support Group',
        date: 'January 6, 2026, 5:00 PM PT',
        description: 'Monthly support group facilitated by social workers for those dealing with grief and loss in the CF community.',
        link: 'https://us02web.zoom.us/meeting/register/tZwuce-vpzwvHdUyorTZGRx0OZgi5_qkgpTS'
      },
      {
        id: 3,
        title: 'Adults with a Late CF Diagnosis Group',
        date: 'January 7, 2026, 5:00 PM PT',
        description: 'Support group specifically for adults who received their CF diagnosis later in life.',
        link: 'https://us02web.zoom.us/meeting/register/tZMtde6qrTMiHN01JhDzAeuaMwhIr-w0M5Cb'
      }
    ],
    resources: [
      {
        id: 1,
        title: 'Conference Recording: Mental Health Impacts of CF Upon the Family',
        organization: 'CFRI',
        description: 'Panel discussion featuring perspectives from a person with CF, sibling, mother, and spouse about the emotional and relational impacts of CF on families.',
        link: 'https://youtu.be/efoMjeAltLM',
        type: 'Video'
      },
      {
        id: 2,
        title: 'Advocacy Film: CF in the South Asian Community',
        organization: 'CFRI',
        description: 'Film highlighting voices of South Asian individuals living with CF, addressing misperceptions and barriers to diagnosis and treatment.',
        link: 'https://youtu.be/KVIk3Bq622M',
        type: 'Video'
      },
      {
        id: 3,
        title: 'CFRI\'s Counseling Program',
        organization: 'CFRI',
        description: 'Financial support for up to 6 therapy sessions ($125 per session) for CF patients and immediate family members.',
        link: 'https://www.cfri.org/education-support/psychosocial-support-programs/',
        type: 'Program'
      },
      {
        id: 4,
        title: 'It\'s a Lung Story Podcast',
        organization: 'Boston Children\'s Hospital CF Center',
        description: 'Educational podcast series covering aging with CF, parenting, sexual health, cancer, and mental health.',
        link: 'https://www.itsalungstorypodcast.com/',
        type: 'Podcast'
      },
      {
        id: 5,
        title: 'Patient Assistance Programs Guide',
        organization: 'CFRI',
        description: 'Comprehensive guide on financial support, copay assistance, scholarships, and patient assistance programs. Available in English and Spanish.',
        link: 'https://www.cfri.org/education-support/cf-patient-assistance-resources/',
        type: 'Guide'
      }
    ],
    research: [
      {
        id: 1,
        title: 'People with CF on Trikafta Are Reducing Use of Supportive Treatments',
        organization: 'German Research Team',
        description: 'Survey found over 80% of Trikafta patients reduced/discontinued supportive therapies, particularly mucus-thinning inhalations and systemic antibiotics. Guidelines needed for long-term effects.',
        link: 'https://www.sciencedirect.com/science/article/pii/S095461112500527X',
        category: 'Treatment'
      },
      {
        id: 2,
        title: 'Increased Risk for Postinfluenza Pneumonia Among CF Carriers',
        organization: 'Iowa Research Study',
        description: 'Study of 38,047 CF carriers found 34% greater risk of pneumonia after flu diagnosis. Incidence rate of pneumonia was 55% higher among CF carriers.',
        link: 'https://academic.oup.com/ofid/article/12/11/ofaf642/8300332',
        category: 'Health Risk'
      }
    ]
  },
  january: {
    month: 'January 2026',
    events: [
      {
        id: 1,
        title: 'Dance Like a Fool – CFRI Virtual Dance-a-thon',
        date: 'February 20, 2026',
        description: 'Virtual fundraising dance-a-thon event to support CFRI programs and CF research.',
        link: 'https://www.cfri.org/events/'
      },
      {
        id: 2,
        title: '"Spring Break" CF Retreat for Adults',
        date: 'April 6-10, 2026',
        description: 'In-person and virtual retreat providing a safe space for adults with CF to connect, learn, and have fun.',
        link: 'https://www.cfri.org/events/'
      },
      {
        id: 3,
        title: 'Purple Power Challenge - CF Awareness Month',
        date: 'May 2026 (All Month)',
        description: 'Month-long CF awareness campaign encouraging community participation to raise awareness.',
        link: 'https://www.cfri.org/events/'
      },
      {
        id: 4,
        title: 'Embrace Mothers Retreat',
        date: 'May 1-3, 2026',
        description: 'In-person retreat specifically for mothers in the CF community to connect and find support.',
        link: 'https://www.cfri.org/events/'
      },
      {
        id: 5,
        title: 'CFRI\'s 39th National CF Education Conference',
        date: 'July 24-26, 2026',
        description: 'Premier annual conference bringing together CF researchers, clinicians, and patients. Available in-person and virtually.',
        link: 'https://www.cfri.org/events/'
      },
      {
        id: 6,
        title: 'Free Wellness Class: Qigong',
        date: 'January 17, 2026, 9:00 AM PT',
        description: 'Free CF wellness class taught by Dr. Julie Desch. All abilities welcome.',
        link: 'https://www.cfri.org/wellness-classes/'
      },
      {
        id: 7,
        title: 'CF Yogi Classes - January Schedule',
        date: 'Mondays 10:00 AM PT, Wednesdays 4:00 PM PT, Sundays 8:00 AM PT',
        description: 'Regular yoga sessions tailored for the CF community to enhance respiratory function, reduce stress, and improve flexibility.',
        link: 'https://www.cfyogi.com/',
        type: 'Recurring'
      },
      {
        id: 8,
        title: 'Polar Plunge for CF and Cancer Research',
        date: 'January 1, 2026',
        description: 'Led by Dr. Steve Freedman, over 30 people plunged into the Atlantic Ocean, raising $16,600 for CF and cancer research.',
        link: 'https://www.cfri.org/events/',
        type: 'Completed'
      }
    ],
    resources: [
      {
        id: 1,
        title: 'NEW PODCAST: Cervical Cancer and CF',
        organization: 'CFRI',
        description: 'Dr. Christina Thornton discusses elevated cervical cancer risk for females with CF, especially post-transplant, covering risk factors, recent research, and prevention strategies.',
        link: 'https://youtu.be/MvX1FGU0EKE',
        type: 'Podcast'
      },
      {
        id: 2,
        title: 'NEW BLOG POST: Skydiving with Purpose, Grief, and Fearlessness',
        organization: 'CFRI',
        description: 'Devanshi Dubey shares her journey of skydiving at 13,000 feet after receiving proper CF care at age 19, demonstrating what\'s possible despite CF challenges.',
        link: 'https://www.cfri.org/skydiving-for-every-person-with-cf/',
        type: 'Blog Post'
      },
      {
        id: 3,
        title: 'Awareness & Advocacy for 50 Years Film',
        organization: 'CFRI',
        description: 'CFRI\'s 50th anniversary advocacy film showcasing their partnership with the CF community through awareness campaigns, research funding, and advocacy.',
        link: 'https://youtu.be/KVIk3Bq622M',
        type: 'Video'
      },
      {
        id: 4,
        title: 'Conference Recording: Guts, Glitter, Glory – Dylan Mortimer',
        organization: 'CFRI',
        description: 'Artist Dylan Mortimer shares his CF journey including two double lung transplants, and how his artwork reflects his CF experience using glitter as his medium.',
        link: 'https://youtu.be/S-hfk7P22Og',
        type: 'Conference Recording'
      },
      {
        id: 5,
        title: 'Advocacy Film: CF in the South Asian Community',
        organization: 'CFRI',
        description: 'Powerful film highlighting voices of South Asian individuals with CF, addressing diagnosis barriers and treatment access challenges.',
        link: 'https://youtu.be/KVIk3Bq622M',
        type: 'Video'
      }
    ],
    research: [
      {
        id: 1,
        title: 'Functional Lung MRIs Predict Pulmonary Exacerbations in CF',
        organization: 'US and Canadian Researchers',
        description: 'Study of 106 CF patients found that impaired lung ventilation in MRI imaging indicated 2x likelihood of pulmonary exacerbations over next two years. Xenon MRI scans measured ventilation defect percent (VDP).',
        link: 'https://www.sciencedirect.com/science/article/abs/pii/S0012369225056892',
        category: 'Diagnostic Technology'
      },
      {
        id: 2,
        title: 'Aspergillus Fumigatus Allergens and Severe Bronchiectasis Exacerbations',
        organization: 'International Study',
        description: 'Study of 277 patients from 6 countries found sensitization to specific Aspergillus fumigatus allergens (rAsp f 12, 15, 17) significantly increased hospitalization risk for bronchiectasis exacerbations.',
        link: 'https://journal.chestnet.org/article/S0012-3692(25)05826-X/fulltext',
        category: 'Medical Discovery'
      },
      {
        id: 3,
        title: 'SEEKING PARTICIPANTS: Peri- and Post-Menopausal Impacts in CF Study',
        organization: 'University of Illinois Chicago',
        description: 'Research study investigating how menopause affects females with CF, ages 40-65. Includes baseline questionnaire, 3 surveys, and Zoom interviews.',
        link: 'https://redcap.link/menopauseinterviewstudyeligibilitysurvey',
        category: 'Clinical Study'
      },
      {
        id: 4,
        title: 'SOAR Act Hearing in House Energy and Commerce',
        organization: 'US Congress',
        description: 'Supplemental Oxygen Access Reform Act discussed to improve portable oxygen access for Medicare recipients with CF and other respiratory conditions.',
        link: 'https://www.cfri.org/',
        category: 'Advocacy'
      },
      {
        id: 5,
        title: 'Give Kids a Chance Act Fails in Senate',
        organization: 'US Senate',
        description: 'Bipartisan bill to extend FDA\'s Rare Pediatric Disease Priority Review Voucher Program for 5 more years failed. The program has helped develop 63 new treatments for children with rare diseases.',
        link: 'https://www.cfri.org/',
        category: 'Advocacy'
      }
    ]
  }
};

const Newsletter = () => {
  const [selectedMonth, setSelectedMonth] = useState('january');
  const [activeTab, setActiveTab] = useState('events');

  const currentNewsletter = newsletterData[selectedMonth];

  return (
    <div className="newsletter-container">
      <div className="newsletter-header">
        <h1>📰 CFRI Community Newsletters</h1>
        <p className="newsletter-subtitle">
          Stay updated with the latest events, resources, and research from the Cystic Fibrosis Research Institute
        </p>
      </div>

      {/* Month Selector */}
      <div className="month-selector">
        <button
          className={`month-btn ${selectedMonth === 'november' ? 'active' : ''}`}
          onClick={() => setSelectedMonth('november')}
        >
          📅 November 2025
        </button>
        <button
          className={`month-btn ${selectedMonth === 'december' ? 'active' : ''}`}
          onClick={() => setSelectedMonth('december')}
        >
          📅 December 2025
        </button>
        <button
          className={`month-btn ${selectedMonth === 'january' ? 'active' : ''}`}
          onClick={() => setSelectedMonth('january')}
        >
          📅 January 2026
        </button>
      </div>

      {/* Current Month Display */}
      <div className="current-month-badge">
        <span className="month-icon">📆</span>
        <h2>{currentNewsletter.month}</h2>
      </div>

      {/* Content Tabs */}
      <div className="content-tabs">
        <button
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🎉 Events ({currentNewsletter.events.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          📚 Resources ({currentNewsletter.resources.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setActiveTab('research')}
        >
          🔬 Research ({currentNewsletter.research.length})
        </button>
      </div>

      {/* Content Display */}
      <div className="newsletter-content">
        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="events-section">
            <div className="section-header">
              <h3>🎉 Upcoming Events & Programs</h3>
              <p>Join the CF community at these events and support groups</p>
            </div>
            <div className="items-grid">
              {currentNewsletter.events.map(event => (
                <div key={event.id} className="item-card event-card">
                  <div className="card-header">
                    <h4>{event.title}</h4>
                    {event.type && <span className="event-type-badge">{event.type}</span>}
                  </div>
                  <div className="card-date">
                    <span className="date-icon">📅</span>
                    {event.date}
                  </div>
                  <p className="card-description">{event.description}</p>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    Learn More & Register →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="resources-section">
            <div className="section-header">
              <h3>📚 Educational Resources</h3>
              <p>Videos, podcasts, guides, and programs for the CF community</p>
            </div>
            <div className="items-grid">
              {currentNewsletter.resources.map(resource => (
                <div key={resource.id} className="item-card resource-card">
                  <div className="card-header">
                    <h4>{resource.title}</h4>
                    <span className="resource-type-badge">{resource.type}</span>
                  </div>
                  <div className="card-organization">
                    <span className="org-icon">🏥</span>
                    {resource.organization}
                  </div>
                  <p className="card-description">{resource.description}</p>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    Access Resource →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Tab */}
        {activeTab === 'research' && (
          <div className="research-section">
            <div className="section-header">
              <h3>🔬 Research Updates</h3>
              <p>Latest findings, clinical trials, and advocacy efforts</p>
            </div>
            <div className="items-grid">
              {currentNewsletter.research.map(research => (
                <div key={research.id} className="item-card research-card">
                  <div className="card-header">
                    <h4>{research.title}</h4>
                    <span className="research-category-badge">{research.category}</span>
                  </div>
                  <div className="card-organization">
                    <span className="org-icon">🔬</span>
                    {research.organization}
                  </div>
                  <p className="card-description">{research.description}</p>
                  <a
                    href={research.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    Read Full Study →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="newsletter-footer">
        <div className="footer-info">
          <h4>📧 About CFRI Newsletters</h4>
          <p>
            These newsletters are published by the Cystic Fibrosis Research Institute (CFRI),
            a nonprofit organization dedicated to finding a cure for CF while enhancing quality
            of life for the CF community through research, education, and support programs.
          </p>
          <a
            href="https://www.cfri.org"
            target="_blank"
            rel="noopener noreferrer"
            className="cfri-link"
          >
            Visit CFRI Website →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
