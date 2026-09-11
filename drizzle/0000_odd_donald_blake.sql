CREATE TABLE `contact_submissions` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(254) NOT NULL,
	`message` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscriptions` (
	`id` varchar(36) NOT NULL,
	`email` varchar(254) NOT NULL,
	`locale` varchar(8) NOT NULL DEFAULT 'de',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `idx_contact_created_at` ON `contact_submissions` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_contact_email` ON `contact_submissions` (`email`);--> statement-breakpoint
CREATE INDEX `idx_newsletter_created_at` ON `newsletter_subscriptions` (`created_at`);