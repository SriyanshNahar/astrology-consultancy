import { useState, useEffect } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

type FormData = {
  fullName: string;
  dob: string;
  tob: string;
  pob: string;
  phone: string;
  question: string;
  consent: boolean;
};

const wellWishes = [
  "May the stars guide you to peace and prosperity! ✨",
  "Wishing you clarity and abundance on your life's journey! 🌟",
  "May the universe align in your favor! 🌌",
  "Sending you positive cosmic energy and bright blessings! 🌙",
  "May your path be illuminated with wisdom and joy! 💫",
  "Wishing you harmony, success, and spiritual growth! 🕊️",
  "May your questions find clear and profound answers! 🔮"
];

export default function ConsultationForm() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useHookForm<FormData>();
  const consentValue = watch('consent');

  // Image Upload States
  const [uploadProgress1, setUploadProgress1] = useState(0);
  const [uploadedImageUrl1, setUploadedImageUrl1] = useState<string | null>(null);
  const [isUploadingImage1, setIsUploadingImage1] = useState(false);

  const [uploadProgress2, setUploadProgress2] = useState(0);
  const [uploadedImageUrl2, setUploadedImageUrl2] = useState<string | null>(null);
  const [isUploadingImage2, setIsUploadingImage2] = useState(false);

  const [submittedData, setSubmittedData] = useState<{ success: boolean; wish: string } | null>(null);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  const detectSize = () => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  }

  useEffect(() => {
    window.addEventListener('resize', detectSize);
    return () => {
      window.removeEventListener('resize', detectSize);
    }
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageNum: 1 | 2
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const setUploading = setImageNum === 1 ? setIsUploadingImage1 : setIsUploadingImage2;
    const setProgress = setImageNum === 1 ? setUploadProgress1 : setUploadProgress2;
    const setUrl = setImageNum === 1 ? setUploadedImageUrl1 : setUploadedImageUrl2;

    setUploading(true);
    setProgress(0);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 15;
      });
    }, 200);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('palms')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload palm photo. Ensure the 'palms' bucket policies are set.");
      } else if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('palms')
          .getPublicUrl(filePath);

        setUrl(publicUrlData.publicUrl);
        setProgress(100);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("An error occurred during upload.");
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
      // Let React batch the final state updates
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.consent) {
      toast.error('Please accept the consent to proceed.');
      return;
    }

    try {
      // Insert into database with the uploaded image URLs
      const { error } = await supabase
        .from('consultations')
        .insert([{
          full_name: data.fullName,
          dob: data.dob,
          tob: data.tob,
          pob: data.pob,
          phone: data.phone,
          question: data.question,
          consent_accepted: data.consent,
          palm_photo_url: uploadedImageUrl1,
          palm_photo_url_2: uploadedImageUrl2,
          status: 'Pending',
        }]);

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      // Select a random well-wish
      const randomWish = wellWishes[Math.floor(Math.random() * wellWishes.length)];

      setSubmittedData({ success: true, wish: randomWish });
      reset();
      setUploadedImageUrl1(null);
      setUploadProgress1(0);
      setUploadedImageUrl2(null);
      setUploadProgress2(0);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  const anyUploading = isUploadingImage1 || isUploadingImage2;

  return (
    <section id="kundli" className="py-24 relative z-10 bg-white/30">
      {/* Confetti mounts precisely when success is true */}
      {submittedData?.success && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left Column: Text and Features */}
          <div className="lg:sticky lg:top-32 pt-4 lg:pt-10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark mb-6 leading-tight">
              Get Your Kundli Reading
            </h2>
            <p className="text-dark/70 text-lg mb-10 leading-relaxed max-w-lg">
              Fill out the form below to receive a personalized analysis of your birth chart from our expert astrologers.
            </p>

            <div className="space-y-6">
              {[
                "Detailed Life Predictions",
                "Remedial Measures",
                "100% Confidentiality",
                "Consultation Fee: ₹399"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <CheckCircle2 className="w-7 h-7 text-gold flex-shrink-0" />
                  <span className="text-dark/80 font-medium text-xl">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 bg-red-50/80 border border-red-200/60 rounded-2xl shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1 uppercase tracking-wider text-sm">Important Policy</h4>
                  <p className="text-sm text-red-700/90 leading-relaxed">
                    Please <strong>do not call or send messages on WhatsApp</strong>. All consultation requests and inquiries must be submitted exclusively through this form. We will reach out to you after reviewing your details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 sm:p-8 md:p-10 rounded-3xl"
          >
            {submittedData?.success ? (
              <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-500">
                <div className="text-8xl text-gold drop-shadow-md mb-2 leading-none">ॐ</div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-dark">
                  Consultation Request Submitted!
                </h3>
                <div className="w-16 h-1 bg-gold mx-auto rounded-full"></div>
                <p className="text-xl text-dark/80 font-medium italic mt-4 px-4 leading-relaxed">
                  "{submittedData.wish}"
                </p>
                <button
                  onClick={() => setSubmittedData(null)}
                  className="mt-8 px-8 py-3 bg-white border border-gold/30 text-gold-dark rounded-full hover:bg-gold/5 transition-colors shadow-sm"
                >
                  Book Another Consultation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      {...register('dob', { required: 'Date of birth is required' })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                    />
                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2">Time of Birth</label>
                    <input
                      type="time"
                      {...register('tob', { required: 'Time of birth is required' })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                    />
                    {errors.tob && <p className="text-red-500 text-sm mt-1">{errors.tob.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Place of Birth</label>
                  <input
                    type="text"
                    {...register('pob', { required: 'Place of birth is required' })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                    placeholder="City, State, Country"
                  />
                  {errors.pob && <p className="text-red-500 text-sm mt-1">{errors.pob.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[0-9+ ]{10,15}$/, message: 'Invalid phone number' }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all shadow-sm"
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Your Problem / Question</label>
                  <textarea
                    {...register('question', { required: 'Please describe your query' })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none shadow-sm"
                    placeholder="Describe your situation or what you'd like to know..."
                  ></textarea>
                  {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question.message}</p>}
                </div>

                {/* Palm Photos Upload UI (Left and Right) */}
                <div className="bg-white/40 p-5 rounded-xl border border-gold/20">
                  <label className="block text-sm font-medium text-dark/80 mb-1">
                    Upload Palm Photos <span className="text-dark/50 font-normal">(Optional)</span>
                  </label>
                  <p className="text-xs text-dark/60 mb-4">
                    For a more detailed reading, you may upload photos of both your palms.The Palms images should be clear or in HD image resolutions.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left Palm Photo Box */}
                    <div className="relative flex flex-col w-full">
                      <span className="text-xs font-semibold text-dark/70 mb-2 uppercase tracking-wide">Left Palm</span>
                      {!uploadedImageUrl1 ? (
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gold/30 ${isUploadingImage1 ? 'border-solid bg-white/60' : 'border-dashed cursor-pointer bg-white/50 hover:bg-white/80'} rounded-lg transition-colors overflow-hidden relative`}>
                          {isUploadingImage1 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress1}%` }} />
                          )}
                          <div className="flex flex-col items-center justify-center text-center px-2">
                            {isUploadingImage1 ? (
                              <>
                                <Loader2 className="w-6 h-6 mb-2 text-gold animate-spin" />
                                <p className="text-xs font-medium text-dark">Uploading... {uploadProgress1}%</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 mb-2 text-gold/60" />
                                <p className="text-xs text-dark/70"><span className="font-semibold">Select Photo</span></p>
                                <p className="text-[10px] text-dark/50 mt-1">Max 5MB</p>
                              </>
                            )}
                          </div>
                          <input type="file" className="hidden" accept="image/*" disabled={isUploadingImage1} onChange={(e) => handleImageUpload(e, 1)} />
                        </label>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-500/50 bg-green-50/50 rounded-lg relative overflow-hidden">
                          <CheckCircle2 className="w-6 h-6 mb-1 text-green-500" />
                          <p className="text-xs font-medium text-green-700">Uploaded!</p>
                          <button type="button" onClick={() => { setUploadedImageUrl1(null); setUploadProgress1(0); }} className="text-[10px] text-red-500 hover:text-red-700 mt-2 underline">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right Palm Photo Box */}
                    <div className="relative flex flex-col w-full">
                      <span className="text-xs font-semibold text-dark/70 mb-2 uppercase tracking-wide">Right Palm</span>
                      {!uploadedImageUrl2 ? (
                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gold/30 ${isUploadingImage2 ? 'border-solid bg-white/60' : 'border-dashed cursor-pointer bg-white/50 hover:bg-white/80'} rounded-lg transition-colors overflow-hidden relative`}>
                          {isUploadingImage2 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress2}%` }} />
                          )}
                          <div className="flex flex-col items-center justify-center text-center px-2">
                            {isUploadingImage2 ? (
                              <>
                                <Loader2 className="w-6 h-6 mb-2 text-gold animate-spin" />
                                <p className="text-xs font-medium text-dark">Uploading... {uploadProgress2}%</p>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 mb-2 text-gold/60" />
                                <p className="text-xs text-dark/70"><span className="font-semibold">Select Photo</span></p>
                                <p className="text-[10px] text-dark/50 mt-1">Max 5MB</p>
                              </>
                            )}
                          </div>
                          <input type="file" className="hidden" accept="image/*" disabled={isUploadingImage2} onChange={(e) => handleImageUpload(e, 2)} />
                        </label>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-500/50 bg-green-50/50 rounded-lg relative overflow-hidden">
                          <CheckCircle2 className="w-6 h-6 mb-1 text-green-500" />
                          <p className="text-xs font-medium text-green-700">Uploaded!</p>
                          <button type="button" onClick={() => { setUploadedImageUrl2(null); setUploadProgress2(0); }} className="text-[10px] text-red-500 hover:text-red-700 mt-2 underline">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="bg-gold/5 p-5 rounded-xl border border-gold/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        {...register('consent', { required: 'You must accept the terms' })}
                        className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold"
                      />
                    </div>
                    <span className="text-xs text-dark/70 leading-relaxed">
                      I confirm that all details provided by me are accurate to the best of my knowledge. I understand that incorrect birth details may affect astrology analysis results. The consultancy is based on spiritual and astrological guidance only. The platform and astrologer are not responsible for inaccurate predictions caused by false or incomplete information.
                    </span>
                  </label>
                  {errors.consent && <p className="text-red-500 text-xs mt-2 ml-7">{errors.consent.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || anyUploading || !consentValue}
                    className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all ${isSubmitting || anyUploading || !consentValue
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-dark hover:bg-dark/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                      }`}
                  >
                    {(isSubmitting || anyUploading) ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {anyUploading ? 'Wait for images to upload...' : 'Submitting Details...'}
                      </>
                    ) : (
                      'Submit Details'
                    )}
                  </button>
                  <p className="text-center text-sm font-medium text-dark/80 mt-4">
                    Consultation Fee: <span className="text-gold-dark text-base font-bold tracking-wide">₹399</span>
                  </p>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
