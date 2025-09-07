import { FontSource, loadAsync } from 'expo-font';
import { useEffect, useState } from 'react';

const fontsToLoad = {
  thin: require('@assets/fonts/Inter-Thin.ttf'),
  light: require('@assets/fonts/Inter-Light.ttf'),
  regular: require('@assets/fonts/Inter-Regular.ttf'),
  medium: require('@assets/fonts/Inter-Medium.ttf'),
  bold: require('@assets/fonts/Inter-Bold.ttf'),
  black: require('@assets/fonts/Inter-Black.ttf'),
  semibold: require('@assets/fonts/Inter-SemiBold.ttf'),
  extrabold: require('@assets/fonts/Inter-ExtraBold.ttf'),
  extralight: require('@assets/fonts/Inter-ExtraLight.ttf'),

  //Monserrat
  Montserrat_Italic: require('@assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
  Montserrat: require('@assets/fonts/Montserrat-VariableFont_wght.ttf'),

  //Libre Baskerville
  LibreBaskerville_Italic: require('@assets/fonts/LibreBaskerville-Italic.ttf'),
  LibreBaskerville_Bold: require('@assets/fonts/LibreBaskerville-Bold.ttf'),
  LibreBaskerville: require('@assets/fonts/LibreBaskerville-Regular.ttf'),
} as Record<string, FontSource>;

export default function useCustomFonts({
  callback,
}: {
  callback?: () => void;
}): [boolean, Error | undefined] {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    loadAsync(fontsToLoad)
      .then(() => {
        // Change the state.
        setLoaded(true);

        // Call the parent's callback.
        callback?.();
      })
      .catch((e) => {
        setError(e);
        console.error('Fonts not loaded.', e);
      });
  }, [callback]);

  return [loaded, error];
}
