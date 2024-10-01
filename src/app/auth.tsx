import { supabase } from '../../lib/supabaseClient';

export const Auth = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error("Error: ", error);
  };

  return (
    <div>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export async function getServerSideProps() {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return { redirect: { destination: '/auth', permanent: false } };
    }
    return { props: {} };
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
  
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(`public/${file.name}`, file);
  
    if (error) {
      console.error("Error uploading file:", error);
    } else {
      console.log("File uploaded successfully:", data);
    }
  };


  const getImageUrl = async (filePath) => {
    const { publicURL, error } = supabase
      .storage
      .from('images')
      .getPublicUrl(filePath);
  
    if (error) {
      console.error("Error fetching public URL:", error);
    } else {
      return publicURL;
    }
  };


  import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${req.body.fileName}`, req.body.file);
    
    if (error) return res.status(500).json({ error: error.message });
    
    return res.status(200).json({ data });
  }
}