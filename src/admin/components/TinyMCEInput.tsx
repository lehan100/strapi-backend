import * as React from 'react';

import { Field } from '@strapi/design-system';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

import 'tinymce/icons/default';
import 'tinymce/models/dom';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/themes/silver';

const TinyMCEInput = React.memo((props: any) => {
  const {
    attribute,
    disabled,
    error,
    hint,
    label,
    labelAction,
    name,
    onChange,
    placeholder,
    required,
    value,
  } = props;

  const handleChange = (nextValue: string) => {
    onChange({
      target: {
        name,
        type: attribute?.type || 'richtext',
        value: nextValue,
      },
    });
  };

  return (
    <Field.Root name={name} hint={hint} error={error} required={required}>
      <Field.Label action={labelAction}>{label}</Field.Label>
      <TinyMCEEditor
        disabled={disabled}
        value={value || ''}
        onEditorChange={handleChange}
        init={{
          license_key: 'gpl',
          height: 420,
          menubar: false,
          branding: false,
          plugins:
            'advlist autolink lists link image charmap preview searchreplace code fullscreen table help wordcount media',
          toolbar:
            'undo redo | blocks | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat code fullscreen',
          skin: false,
          content_css: false,
          content_style:
            'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; }',
          placeholder: placeholder || '',
        }}
      />
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
});

export default TinyMCEInput;
