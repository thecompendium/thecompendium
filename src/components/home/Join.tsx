import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { isApplicationPeriod, getApplicationMessage } from '@/utils/applicationPeriod';

const Join = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApplyClick = () => {
    if (isApplicationPeriod()) {
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get the form element
      const form = e.target as HTMLFormElement;
      
      // Add current date and time to form data
      const currentDate = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'Asia/Kolkata'
      });

      // Create FormData object
      const formData = new FormData(form);
      formData.append('Submission Date', currentDate);
      
      // Send data using fetch
      fetch('https://formsubmit.co/ajax/thecompendiumiare@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Reset form and show success message
        form.reset();
        setIsFormOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-8 md:p-12 rounded-lg">
          <h2 className="text-3xl font-serif font-bold text-white mb-6">Join Our Team</h2>
          <p className="text-white/80 mb-8">
            The Compendium Club is always looking for passionate students to join our team as writers, editors, photographers, designers, and more. Gain valuable experience in various domains and contribute to our growing community.
          </p>
          
          <div className="space-y-4 mb-8">
            {[
              'Develop professional writing and editing skills',
              'Build your portfolio with the help of the club',
              'Connect with like-minded creative individuals',
              'Participate in workshops and special events'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <Check className="h-5 w-5 text-theme-yellow mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/80">{benefit}</span>
              </div>
            ))}
          </div>

          <div>
            <button
              onClick={handleApplyClick}
              className={`px-6 py-3 font-medium rounded-md transition-colors ${
                isApplicationPeriod()
                  ? 'bg-theme-yellow text-theme-blue hover:bg-theme-yellow/90'
                  : 'bg-gray-500 text-white cursor-not-allowed'
              }`}
              disabled={!isApplicationPeriod()}
            >
              Apply to Join
            </button>
            <p className={`mt-3 text-sm ${isApplicationPeriod() ? 'text-green-400' : 'text-yellow-400'}`}>
              {getApplicationMessage()}
            </p>
          </div>
        </div>

        <div className="relative h-[400px] md:h-auto">
          <img
            src="path-to-your-image.jpg"
            alt="Team collaboration"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Application Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-theme-blue rounded-lg w-full max-w-xl relative">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute right-3 top-3 text-theme-blue dark:text-white/70 hover:text-theme-blue/70 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-theme-blue dark:text-white mb-4">Join Our Team</h3>
              
              <form 
                onSubmit={handleFormSubmit}
                className="space-y-4"
              >
                {/* Hidden FormSubmit.co fields */}
                <input type="hidden" name="_subject" value="New Team Application!" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="true" />
                <input type="hidden" name="_autoresponse" value="Thank you for your application! We have received your submission and will review it soon." />

                <div>
                  <label htmlFor="name" className="block text-sm text-theme-blue dark:text-white mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-theme-blue dark:text-white mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Your email address"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm text-theme-blue dark:text-white mb-1">Year</label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                  >
                    <option value="">Select your year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm text-theme-blue dark:text-white mb-1">Branch</label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Your branch"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm text-theme-blue dark:text-white mb-1">Interested Role</label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                  >
                    <option value="">Select role</option>
                    <option value="Writer">Writer</option>
                    <option value="Editor">Editor</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Designer">Designer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-theme-blue dark:text-white mb-1">Why do you want to join?</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Tell us why you want to join the team and what you can contribute..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-theme-yellow text-theme-blue font-medium rounded-md hover:bg-theme-yellow/90 transition-colors text-sm"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-white/30 text-theme-blue dark:text-white font-medium rounded-md hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Popup */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          Thank you for your application! We will review it and get back to you soon.
        </div>
      )}
    </section>
  );
};

export default Join; 