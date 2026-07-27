"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import css from "./page.module.css";

export default function ProfileEditPage() {
  const router = useRouter();
    const { user, setUser } = useAuthStore();
    
  const [username, setUsername] = useState(user?.username || "");

  const mutation = useMutation({
    mutationFn: (newUsername: string) => updateMe({ username: newUsername }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      router.push("/profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      mutation.mutate(username);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) {
    return <div className={css.loading}>Loading profile data...</div>;
  }

  return (
    <main className={css.mainContent}>

      <div className={css.profileCard} key={user.username}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "https://ac.goit.global/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p className={css.emailText}>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {mutation.isError && (
            <p className={css.error}>
              Failed to update profile. Please try again.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}