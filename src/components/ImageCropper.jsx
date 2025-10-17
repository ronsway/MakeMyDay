import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { X, Check, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ isOpen, onClose, onCrop, imageUrl, aspectRatio = 1 }) => {
  const { t } = useTranslation();
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height,
      ),
      width,
      height,
    ));
  }, [aspectRatio]);

  const getCroppedImg = useCallback(async () => {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx || !image || !completedCrop) {
      throw new Error('Failed to get canvas context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.95);
    });
  }, [completedCrop, scale, rotate]);

  const handleCrop = async () => {
    try {
      const croppedImageBlob = await getCroppedImg();
      const reader = new FileReader();
      reader.onload = () => {
        onCrop(reader.result);
        onClose();
      };
      reader.readAsDataURL(croppedImageBlob);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const resetTransformations = () => {
    setScale(1);
    setRotate(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-silver-200">
            <h3 className="text-lg font-semibold text-navy-700">
              {t('family.cropImage', 'חתוך תמונה')}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-silver-500 hover:text-silver-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Cropper */}
          <div className="p-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative max-w-full max-h-96 overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  className="max-h-96"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageUrl}
                    style={{
                      transform: `scale(${scale}) rotate(${rotate}deg)`,
                      maxHeight: '384px',
                      maxWidth: '100%',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 w-full">
                {/* Scale Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                    className="p-2 text-silver-600 hover:bg-silver-100 rounded-lg transition-colors"
                    title={t('family.zoomOut', 'הקטן')}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-silver-600 min-w-12 text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => setScale(Math.min(3, scale + 0.1))}
                    className="p-2 text-silver-600 hover:bg-silver-100 rounded-lg transition-colors"
                    title={t('family.zoomIn', 'הגדל')}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Rotate Control */}
                <button
                  onClick={() => setRotate((rotate + 90) % 360)}
                  className="p-2 text-silver-600 hover:bg-silver-100 rounded-lg transition-colors"
                  title={t('family.rotate', 'סובב')}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Reset Button */}
                <button
                  onClick={resetTransformations}
                  className="px-3 py-1 text-sm text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors"
                >
                  {t('family.reset', 'איפוס')}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 p-4 border-t border-silver-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-silver-600 border border-silver-300 rounded-lg hover:bg-silver-50 transition-colors"
            >
              {t('confirmation.cancel')}
            </button>
            <button
              onClick={handleCrop}
              disabled={!completedCrop}
              className="flex-1 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors disabled:bg-silver-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t('family.cropAndSave', 'חתוך ושמור')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageCropper;