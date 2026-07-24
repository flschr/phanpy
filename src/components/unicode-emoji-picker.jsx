import { useLingui } from '@lingui/react/macro';
import { useEffect, useRef, useState } from 'preact/hooks';

import Loader from './loader';

export default function UnicodeEmojiPicker({ onSelect }) {
  const { i18n } = useLingui();
  const pickerRef = useRef();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    import('emoji-picker-element').then(() => {
      if (active) setReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    const handleEmojiClick = (event) => {
      const emoji = event.detail?.unicode;
      if (emoji) onSelect?.(emoji);
    };

    picker.addEventListener('emoji-click', handleEmojiClick);
    return () => picker.removeEventListener('emoji-click', handleEmojiClick);
  }, [onSelect, ready]);

  return (
    <div class="unicode-emoji-picker">
      {!ready && <Loader />}
      <emoji-picker
        ref={pickerRef}
        class={ready ? '' : 'hidden'}
        locale={i18n.locale}
      />
    </div>
  );
}
