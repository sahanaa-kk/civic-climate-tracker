import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Camera, MapPin, Loader2 } from 'lucide-react';

const schema = yup.object({
  city: yup.string().required('City is required'),
  category: yup.string().required('Please select a category'),
  description: yup.string().required('Description is required').min(10, 'Must be at least 10 characters'),
}).required();

export default function CitizenReportForm({ onSubmitSuccess, defaultLocation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState(defaultLocation || null);
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (defaultLocation) {
      setLocation(defaultLocation);
    }
  }, [defaultLocation]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Type validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Please upload a valid image (JPEG, PNG, WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Size validation (Max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert('Image exceeds the 5MB size limit. Please choose a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPhoto(file);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Could not fetch location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // MOCK: Submit logic using Firebase
      // const reportRef = collection(db, 'reports');
      // await addDoc(reportRef, { ...data, location, status: 'submitted', created_at: serverTimestamp() });
      
      const newReport = {
        id: 'rd_' + Date.now(),
        ...data,
        location: location,
        photo: photo ? URL.createObjectURL(photo) : null,
        status: 'Pending',
        timestamp: Date.now(),
      };
      
      console.log('Submitted issue:', newReport);
      
      // Reset form on success
      reset();
      setLocation(defaultLocation || null);
      setPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onSubmitSuccess) onSubmitSuccess(newReport);
      
      alert('Report submitted successfully! AI is validating the issue.');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Report an Issue</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            {...register("category")}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            <option value="">Select an issue type</option>
            <option value="waste">Waste / Garbage</option>
            <option value="pollution">Air Pollution</option>
            <option value="carbon">Carbon Emission</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City / State</label>
          <input
            type="text"
            {...register("city")}
            className="mt-1 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm border border-gray-300 rounded-md p-2"
            placeholder="e.g. Mumbai, Maharashtra"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="mt-1 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm border border-gray-300 rounded-md p-2"
            placeholder="Describe the issue you've observed..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col w-full sm:w-auto">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Camera className={`mr-2 h-4 w-4 ${photo ? 'text-green-500' : 'text-gray-500'}`} />
              {photo ? 'Photo Added' : 'Upload Photo'}
            </button>
            {photo && <p className="mt-1 text-xs text-green-600 truncate max-w-[150px]">{photo.name}</p>}
          </div>
          
          <button
            type="button"
            onClick={getLocation}
            className={`inline-flex justify-center items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none ${location ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
          >
            <MapPin className={`mr-2 h-4 w-4 ${location ? 'text-green-500' : 'text-gray-500'}`} />
            {location ? 'Location Captured' : 'Get Location'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !location}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Report'}
        </button>
        {!location && <p className="text-xs text-gray-500 text-center">Location is required to submit a report.</p>}
      </form>
    </div>
  );
}
