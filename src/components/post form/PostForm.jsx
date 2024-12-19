import React, { useCallback } from "react";
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from "../index";
import appwriteServices from "../../appwrite/config";
import authServices from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
  // console.log("Watch Title:", watch("title")); // Check if title updates
  // console.log("GetValues Title:", getValues("title")); // Check default value
  console.log("Watch Slug:", watch("slug"));
  console.log("GetValues Slug:", getValues("slug"));

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const authState=useSelector((state)=>state.auth);
  console.log("PostForm :: Auth State::",authState);
  
  const submit = async (data) => {
    const user = await authServices.getCurrentUser();
    console.log("PostForm :: user::",user.$id);
    
    
    if (!user) {
      console.error('User not authenticated');
    }
    if (!data.slug) {
      console.error("Slug is undefined or invalid!");
    }
    console.log("POSTFORM :: slug::",data.slug);
    data.slug = data.slug?.trim();
    let file = null;

    if (data.image && data.image[0]) {
      file = await appwriteServices.uploadFile(data.image[0]);
    }

    if (post) {
      if (file) {
        // Delete old image if a new one is uploaded
        appwriteServices.deleteFile(post.featuredImage);
      }
      console.log("ON EDIT :: content::",data.content);
      
      const dbPost = await appwriteServices.updatePost(post.$id, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: file ? file.$id : post.featuredImage, // Use existing image if no new image uploaded
        status: data.status,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      if (!file) {
        console.error("Image is required for new posts.");
        return; // Stop the submission if no image is provided for new posts
      }

      data.featuredImage = file.$id;
      console.log("PostForm :: userData:: ",userData);
      
      const dbPost = await appwriteServices.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: file ? file.$id : post.featuredImage, // Use existing image if no new image uploaded
        status: data.status,
        userId: userData.$id,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    }
  };
  const slugTransform = useCallback((value) => {
    if (!value) return "";
    if (value && typeof value === "string") {
      return value
        .trim() // Remove leading/trailing spaces
        .toLowerCase() // Convert to lowercase
        .replace(/[^\w\s-]/g, "") // Remove all special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with a single hyphen
        .replace(/--+/g, "-"); // Replace multiple hyphens with a single hyphen
    }
    return "";
  }, []);
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title) {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            const transformedValue = slugTransform(e.currentTarget.value);
            setValue("slug", transformedValue, { shouldValidate: true }); // Update form state
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteServices.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
