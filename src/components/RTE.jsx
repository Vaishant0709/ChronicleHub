import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from 'react-hook-form'

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      {/* react-hook-form Controller */}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue} // Set default value directly here
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey="ip325yji95xnp4xbjl634u58gb5nfa273mf3wahit9xb817w" // Replace with your API key from TinyMCE
            value={value} // Controlled component binding
            onEditorChange={(content) => onChange(content)} // Updates react-hook-form
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist", "autolink", "lists", "link", "image", "charmap",
                "preview", "anchor", "searchreplace", "visualblocks", "code",
                "fullscreen", "insertdatetime", "media", "table", "help", "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic forecolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | image media | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              branding: false, // Removes TinyMCE branding watermark
            }}
          />
        )}
      />
    </div>
  );
}
