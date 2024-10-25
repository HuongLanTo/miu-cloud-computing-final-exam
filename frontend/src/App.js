import './App.css';
import DatabaseQuery from './DatabaseQuery';
import ImageGallery from './ImageGallery';
import ImageUploader from './ImageUploader';

function App() {
  return (
    <div className="App">
      <ImageUploader/>
      <hr/>
      <DatabaseQuery/>
      <hr/>
      <ImageGallery/>
    </div>
  );
}

export default App;
