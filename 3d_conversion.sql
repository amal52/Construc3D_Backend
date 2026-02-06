-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : lun. 21 avr. 2025 à 20:24
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `3d_conversion`
--

-- --------------------------------------------------------

--
-- Structure de la table `3d_collaborators`
--

CREATE TABLE `3d_collaborators` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('viewer','editor','admin') NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`permissions`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_comments`
--

CREATE TABLE `3d_comments` (
  `id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `position` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`position`)),
  `status` enum('open','resolved','closed') DEFAULT 'open',
  `parent_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_models`
--

CREATE TABLE `3d_models` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `original_file_name` varchar(255) NOT NULL,
  `original_file_url` varchar(255) NOT NULL,
  `model_file_url` varchar(255) DEFAULT NULL,
  `format` varchar(10) NOT NULL,
  `conversion_status` enum('pending','processing','completed','failed') DEFAULT 'pending',
  `conversion_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`conversion_settings`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`metadata`)),
  `version` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_model_exports`
--

CREATE TABLE `3d_model_exports` (
  `id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `format` varchar(10) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_model_versions`
--

CREATE TABLE `3d_model_versions` (
  `id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `version_number` int(11) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `changes_description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_presentations`
--

CREATE TABLE `3d_presentations` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`settings`)),
  `status` enum('draft','active','archived') DEFAULT 'draft',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_projects`
--

CREATE TABLE `3d_projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `creator_id` int(11) NOT NULL,
  `status` enum('draft','processing','completed','archived') DEFAULT 'draft',
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`settings`)),
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `3d_users`
--

CREATE TABLE `3d_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`settings`)),
  `last_login` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `3d_users`
--

INSERT INTO `3d_users` (`id`, `email`, `password`, `settings`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'amal.belhajsalah2003@gmail.com', 'amal123', '{\"theme\": \"dark\"}', '2025-04-21 15:42:58', '2025-04-21 15:42:58', '2025-04-21 15:42:58');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `3d_collaborators`
--
ALTER TABLE `3d_collaborators`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_collaboration` (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_collaborators_project_user` (`project_id`,`user_id`);

--
-- Index pour la table `3d_comments`
--
ALTER TABLE `3d_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `idx_comments_model` (`model_id`),
  ADD KEY `idx_comments_user` (`user_id`);

--
-- Index pour la table `3d_models`
--
ALTER TABLE `3d_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_models_project` (`project_id`),
  ADD KEY `idx_models_status` (`conversion_status`);

--
-- Index pour la table `3d_model_exports`
--
ALTER TABLE `3d_model_exports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `model_id` (`model_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Index pour la table `3d_model_versions`
--
ALTER TABLE `3d_model_versions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_model_versions_model` (`model_id`);

--
-- Index pour la table `3d_presentations`
--
ALTER TABLE `3d_presentations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_presentations_project` (`project_id`);

--
-- Index pour la table `3d_projects`
--
ALTER TABLE `3d_projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_projects_creator` (`creator_id`);

--
-- Index pour la table `3d_users`
--
ALTER TABLE `3d_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `3d_collaborators`
--
ALTER TABLE `3d_collaborators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_comments`
--
ALTER TABLE `3d_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_models`
--
ALTER TABLE `3d_models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_model_exports`
--
ALTER TABLE `3d_model_exports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_model_versions`
--
ALTER TABLE `3d_model_versions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_presentations`
--
ALTER TABLE `3d_presentations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_projects`
--
ALTER TABLE `3d_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `3d_users`
--
ALTER TABLE `3d_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `3d_collaborators`
--
ALTER TABLE `3d_collaborators`
  ADD CONSTRAINT `3d_collaborators_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `3d_projects` (`id`),
  ADD CONSTRAINT `3d_collaborators_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `3d_users` (`id`);

--
-- Contraintes pour la table `3d_comments`
--
ALTER TABLE `3d_comments`
  ADD CONSTRAINT `3d_comments_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `3d_models` (`id`),
  ADD CONSTRAINT `3d_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `3d_users` (`id`),
  ADD CONSTRAINT `3d_comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `3d_comments` (`id`);

--
-- Contraintes pour la table `3d_models`
--
ALTER TABLE `3d_models`
  ADD CONSTRAINT `3d_models_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `3d_projects` (`id`);

--
-- Contraintes pour la table `3d_model_exports`
--
ALTER TABLE `3d_model_exports`
  ADD CONSTRAINT `3d_model_exports_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `3d_models` (`id`),
  ADD CONSTRAINT `3d_model_exports_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `3d_users` (`id`);

--
-- Contraintes pour la table `3d_model_versions`
--
ALTER TABLE `3d_model_versions`
  ADD CONSTRAINT `3d_model_versions_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `3d_models` (`id`),
  ADD CONSTRAINT `3d_model_versions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `3d_users` (`id`);

--
-- Contraintes pour la table `3d_presentations`
--
ALTER TABLE `3d_presentations`
  ADD CONSTRAINT `3d_presentations_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `3d_projects` (`id`),
  ADD CONSTRAINT `3d_presentations_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `3d_users` (`id`);

--
-- Contraintes pour la table `3d_projects`
--
ALTER TABLE `3d_projects`
  ADD CONSTRAINT `3d_projects_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `3d_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
