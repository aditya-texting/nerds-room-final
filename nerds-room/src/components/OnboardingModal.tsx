import React, { useState, useEffect } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

const step1Schema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
  city: z.string().min(2, 'City is required'),
});

const step2Schema = z.object({
  linkedin: z.string().regex(/^[a-zA-Z0-9-]{3,100}$/, 'Invalid LinkedIn username format'),
  github: z.string().regex(/^[a-zA-Z0-9-]{1,39}$/, 'Invalid GitHub username format'),
});

export default function OnboardingModal() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Data
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'WORKING_PROFESSIONAL'>('STUDENT');

  const [errors, setErrors] = useState<any>({});
  
  const [isCheckingGithub, setIsCheckingGithub] = useState(false);
  const [githubStatus, setGithubStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    if (!github) {
      setGithubStatus('idle');
      return;
    }
    
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(github)) {
      setGithubStatus('invalid');
      return;
    }

    setIsCheckingGithub(true);
    setGithubStatus('idle');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${github}`);
        if (res.ok) {
          setGithubStatus('valid');
        } else {
          setGithubStatus('invalid');
        }
      } catch (err) {
        setGithubStatus('invalid');
      } finally {
        setIsCheckingGithub(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [github]);

  if (!user || user.role !== 'OTHER') return null;

  const handleNextStep1 = () => {
    const result = step1Schema.safeParse({ phone, city });
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((e: any) => fieldErrors[e.path[0]] = e.message);
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleNextStep2 = async () => {
    const result = step2Schema.safeParse({ linkedin, github });
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((e: any) => fieldErrors[e.path[0]] = e.message);
      setErrors(fieldErrors);
      return;
    }
    
    if (githubStatus === 'invalid') {
      setErrors({ github: 'Invalid GitHub username' });
      toast.error('Invalid GitHub username');
      return;
    }
    
    setErrors({});
    setStep(3);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/auth/onboarding', {
        phone,
        city,
        linkedin: `https://linkedin.com/in/${linkedin}`,
        github: `https://github.com/${github}`,
        role
      });
      toast.success('Profile updated successfully!');
      await refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div 
            className="h-full bg-nerdBlue transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-nerdDark mb-2">Complete Your Profile</h2>
            <p className="text-gray-500 text-sm">Tell us a bit more about yourself to get started.</p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                  placeholder="Where are you from?"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <button
                onClick={handleNextStep1}
                disabled={!phone || !city}
                className="w-full bg-nerdDark text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdBlue transition-all mt-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">LinkedIn Username <span className="text-red-500">*</span></label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-nerdBlue/20 focus-within:border-nerdBlue transition-all">
                  <span className="px-4 py-3 bg-gray-100 text-gray-500 font-medium border-r border-gray-200 flex-shrink-0">
                    linkedin.com/in/
                  </span>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                    className="w-full px-4 py-3 bg-transparent outline-none"
                    placeholder="username"
                  />
                </div>
                {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">GitHub Username <span className="text-red-500">*</span></label>
                <div className={`flex rounded-xl overflow-hidden border bg-gray-50 transition-all ${githubStatus === 'valid' ? 'border-green-500 focus-within:ring-2 focus-within:ring-green-500/20' : githubStatus === 'invalid' ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-500/20' : 'border-gray-200 focus-within:ring-2 focus-within:ring-nerdBlue/20 focus-within:border-nerdBlue'}`}>
                  <span className="px-4 py-3 bg-gray-100 text-gray-500 font-medium border-r border-gray-200 flex-shrink-0">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                    className="w-full px-4 py-3 bg-transparent outline-none"
                    placeholder="username"
                  />
                  <div className="flex items-center pr-4">
                    {isCheckingGithub && <div className="w-5 h-5 border-2 border-nerdBlue/30 border-t-nerdBlue rounded-full animate-spin" />}
                    {!isCheckingGithub && githubStatus === 'valid' && <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    {!isCheckingGithub && githubStatus === 'invalid' && <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                  </div>
                </div>
                {errors.github && githubStatus !== 'invalid' && <p className="text-red-500 text-xs mt-1">{errors.github}</p>}
                {githubStatus === 'invalid' && !isCheckingGithub && <p className="text-red-500 text-xs mt-1">This GitHub profile does not exist.</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep2}
                  disabled={loading || !linkedin || !github || isCheckingGithub || githubStatus === 'invalid'}
                  className="w-2/3 bg-nerdDark text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdBlue transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Next Step'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 text-center">Are you joining as a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole('STUDENT')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      role === 'STUDENT' ? 'border-nerdBlue bg-nerdBlue/5 text-nerdBlue' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span className="font-bold text-sm text-center">Student /<br/>Participant</span>
                  </button>
                  
                  <button
                    onClick={() => setRole('WORKING_PROFESSIONAL')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                      role === 'WORKING_PROFESSIONAL' ? 'border-nerdBlue bg-nerdBlue/5 text-nerdBlue' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold text-sm text-center">Working<br/>Professional</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-2/3 bg-nerdBlue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-lg hover:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
