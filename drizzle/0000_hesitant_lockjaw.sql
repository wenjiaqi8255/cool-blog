CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"date" timestamp NOT NULL,
	"tags" text[],
	"excerpt" text,
	"body" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"confirmed" boolean DEFAULT true NOT NULL,
	"confirmation_sent_at" timestamp,
	"confirmation_token" text,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
