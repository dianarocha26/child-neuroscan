export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activity_templates: {
        Row: {
          category: string;
          created_at: string | null;
          icon_color: string | null;
          icon_name: string;
          id: string;
          is_public: boolean | null;
          template_description: string | null;
          template_name: string;
          typical_duration_minutes: number | null;
          user_id: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          icon_color?: string | null;
          icon_name: string;
          id?: string;
          is_public?: boolean | null;
          template_description?: string | null;
          template_name: string;
          typical_duration_minutes?: number | null;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          icon_color?: string | null;
          icon_name?: string;
          id?: string;
          is_public?: boolean | null;
          template_description?: string | null;
          template_name?: string;
          typical_duration_minutes?: number | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      analytics_behavior_patterns: {
        Row: {
          behavior_category: string;
          created_at: string | null;
          frequency: number | null;
          id: string;
          insights: Json | null;
          pattern_type: string;
          time_range_end: string;
          time_range_start: string;
          user_id: string;
        };
        Insert: {
          behavior_category: string;
          created_at?: string | null;
          frequency?: number | null;
          id?: string;
          insights?: Json | null;
          pattern_type: string;
          time_range_end: string;
          time_range_start: string;
          user_id: string;
        };
        Update: {
          behavior_category?: string;
          created_at?: string | null;
          frequency?: number | null;
          id?: string;
          insights?: Json | null;
          pattern_type?: string;
          time_range_end?: string;
          time_range_start?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics_correlations: {
        Row: {
          correlation_strength: number | null;
          created_at: string | null;
          date_range_end: string;
          date_range_start: string;
          factor_a: string;
          factor_b: string;
          id: string;
          metadata: Json | null;
          occurrences: number | null;
          user_id: string;
        };
        Insert: {
          correlation_strength?: number | null;
          created_at?: string | null;
          date_range_end: string;
          date_range_start: string;
          factor_a: string;
          factor_b: string;
          id?: string;
          metadata?: Json | null;
          occurrences?: number | null;
          user_id: string;
        };
        Update: {
          correlation_strength?: number | null;
          created_at?: string | null;
          date_range_end?: string;
          date_range_start?: string;
          factor_a?: string;
          factor_b?: string;
          id?: string;
          metadata?: Json | null;
          occurrences?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics_trigger_analysis: {
        Row: {
          created_at: string | null;
          id: string;
          last_updated: string | null;
          severity_distribution: Json | null;
          successful_strategies: Json | null;
          time_patterns: Json | null;
          total_occurrences: number | null;
          trigger_name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          last_updated?: string | null;
          severity_distribution?: Json | null;
          successful_strategies?: Json | null;
          time_patterns?: Json | null;
          total_occurrences?: number | null;
          trigger_name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          last_updated?: string | null;
          severity_distribution?: Json | null;
          successful_strategies?: Json | null;
          time_patterns?: Json | null;
          total_occurrences?: number | null;
          trigger_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics_weekly_summaries: {
        Row: {
          challenging_behaviors: number | null;
          created_at: string | null;
          id: string;
          insights_summary: string | null;
          medication_adherence_rate: number | null;
          mood_average: number | null;
          positive_behaviors: number | null;
          therapy_sessions_attended: number | null;
          top_triggers: Json | null;
          total_behaviors: number | null;
          user_id: string;
          week_end_date: string;
          week_start_date: string;
        };
        Insert: {
          challenging_behaviors?: number | null;
          created_at?: string | null;
          id?: string;
          insights_summary?: string | null;
          medication_adherence_rate?: number | null;
          mood_average?: number | null;
          positive_behaviors?: number | null;
          therapy_sessions_attended?: number | null;
          top_triggers?: Json | null;
          total_behaviors?: number | null;
          user_id: string;
          week_end_date: string;
          week_start_date: string;
        };
        Update: {
          challenging_behaviors?: number | null;
          created_at?: string | null;
          id?: string;
          insights_summary?: string | null;
          medication_adherence_rate?: number | null;
          mood_average?: number | null;
          positive_behaviors?: number | null;
          therapy_sessions_attended?: number | null;
          top_triggers?: Json | null;
          total_behaviors?: number | null;
          user_id?: string;
          week_end_date?: string;
          week_start_date?: string;
        };
        Relationships: [];
      };
      app_logs: {
        Row: {
          created_at: string | null;
          data: Json | null;
          id: string;
          level: string;
          message: string;
          timestamp: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          level: string;
          message: string;
          timestamp?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          level?: string;
          message?: string;
          timestamp?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      appointment_documents: {
        Row: {
          appointment_id: string | null;
          created_at: string | null;
          document_name: string;
          document_type: string;
          id: string;
          notes: string | null;
        };
        Insert: {
          appointment_id?: string | null;
          created_at?: string | null;
          document_name: string;
          document_type: string;
          id?: string;
          notes?: string | null;
        };
        Update: {
          appointment_id?: string | null;
          created_at?: string | null;
          document_name?: string;
          document_type?: string;
          id?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_documents_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
      appointment_followups: {
        Row: {
          appointment_id: string | null;
          completed: boolean | null;
          completed_at: string | null;
          created_at: string | null;
          due_date: string | null;
          followup_item: string;
          id: string;
        };
        Insert: {
          appointment_id?: string | null;
          completed?: boolean | null;
          completed_at?: string | null;
          created_at?: string | null;
          due_date?: string | null;
          followup_item: string;
          id?: string;
        };
        Update: {
          appointment_id?: string | null;
          completed?: boolean | null;
          completed_at?: string | null;
          created_at?: string | null;
          due_date?: string | null;
          followup_item?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_followups_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
      appointment_observations: {
        Row: {
          appointment_id: string | null;
          category: string;
          concern_level: string | null;
          created_at: string | null;
          date_observed: string | null;
          frequency: string | null;
          id: string;
          observation: string;
        };
        Insert: {
          appointment_id?: string | null;
          category: string;
          concern_level?: string | null;
          created_at?: string | null;
          date_observed?: string | null;
          frequency?: string | null;
          id?: string;
          observation: string;
        };
        Update: {
          appointment_id?: string | null;
          category?: string;
          concern_level?: string | null;
          created_at?: string | null;
          date_observed?: string | null;
          frequency?: string | null;
          id?: string;
          observation?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_observations_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
      appointment_questions: {
        Row: {
          answer: string | null;
          answered: boolean | null;
          appointment_id: string | null;
          created_at: string | null;
          id: string;
          priority: string | null;
          question: string;
        };
        Insert: {
          answer?: string | null;
          answered?: boolean | null;
          appointment_id?: string | null;
          created_at?: string | null;
          id?: string;
          priority?: string | null;
          question: string;
        };
        Update: {
          answer?: string | null;
          answered?: boolean | null;
          appointment_id?: string | null;
          created_at?: string | null;
          id?: string;
          priority?: string | null;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointment_questions_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
        ];
      };
      appointment_types: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          preparation_tips: string[] | null;
          typical_duration: number | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          preparation_tips?: string[] | null;
          typical_duration?: number | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          preparation_tips?: string[] | null;
          typical_duration?: number | null;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          appointment_date: string;
          appointment_type_id: string | null;
          child_name: string;
          completed: boolean | null;
          created_at: string | null;
          id: string;
          location: string | null;
          notes: string | null;
          provider_name: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          appointment_date: string;
          appointment_type_id?: string | null;
          child_name: string;
          completed?: boolean | null;
          created_at?: string | null;
          id?: string;
          location?: string | null;
          notes?: string | null;
          provider_name?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          appointment_date?: string;
          appointment_type_id?: string | null;
          child_name?: string;
          completed?: boolean | null;
          created_at?: string | null;
          id?: string;
          location?: string | null;
          notes?: string | null;
          provider_name?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_appointment_type_id_fkey";
            columns: ["appointment_type_id"];
            isOneToOne: false;
            referencedRelation: "appointment_types";
            referencedColumns: ["id"];
          },
        ];
      };
      available_rewards: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          is_available: boolean | null;
          points_cost: number;
          reward_category: string;
          reward_name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_available?: boolean | null;
          points_cost: number;
          reward_category: string;
          reward_name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_available?: boolean | null;
          points_cost?: number;
          reward_category?: string;
          reward_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      behavior_entries: {
        Row: {
          antecedents: string | null;
          behavior_type: string;
          child_name: string;
          consequences: string | null;
          created_at: string | null;
          duration_minutes: number | null;
          effectiveness: number | null;
          entry_date: string;
          entry_time: string;
          id: string;
          interventions_used: string[] | null;
          location: string | null;
          notes: string | null;
          severity: number;
          triggers: string[] | null;
          user_id: string;
        };
        Insert: {
          antecedents?: string | null;
          behavior_type: string;
          child_name: string;
          consequences?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          effectiveness?: number | null;
          entry_date?: string;
          entry_time?: string;
          id?: string;
          interventions_used?: string[] | null;
          location?: string | null;
          notes?: string | null;
          severity: number;
          triggers?: string[] | null;
          user_id: string;
        };
        Update: {
          antecedents?: string | null;
          behavior_type?: string;
          child_name?: string;
          consequences?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          effectiveness?: number | null;
          entry_date?: string;
          entry_time?: string;
          id?: string;
          interventions_used?: string[] | null;
          location?: string | null;
          notes?: string | null;
          severity?: number;
          triggers?: string[] | null;
          user_id?: string;
        };
        Relationships: [];
      };
      behavior_insights: {
        Row: {
          action_suggestion: string | null;
          confidence_score: number | null;
          correlations: Json | null;
          created_at: string | null;
          data_source: string | null;
          description: string;
          dismissed: boolean | null;
          id: string;
          insight_type: string;
          is_actionable: boolean | null;
          title: string;
          user_id: string;
          visualization_data: Json | null;
        };
        Insert: {
          action_suggestion?: string | null;
          confidence_score?: number | null;
          correlations?: Json | null;
          created_at?: string | null;
          data_source?: string | null;
          description: string;
          dismissed?: boolean | null;
          id?: string;
          insight_type: string;
          is_actionable?: boolean | null;
          title: string;
          user_id: string;
          visualization_data?: Json | null;
        };
        Update: {
          action_suggestion?: string | null;
          confidence_score?: number | null;
          correlations?: Json | null;
          created_at?: string | null;
          data_source?: string | null;
          description?: string;
          dismissed?: boolean | null;
          id?: string;
          insight_type?: string;
          is_actionable?: boolean | null;
          title?: string;
          user_id?: string;
          visualization_data?: Json | null;
        };
        Relationships: [];
      };
      behavior_interventions: {
        Row: {
          created_at: string | null;
          id: string;
          intervention_name: string;
          intervention_type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          intervention_name: string;
          intervention_type: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          intervention_name?: string;
          intervention_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      behavior_triggers: {
        Row: {
          created_at: string | null;
          id: string;
          trigger_category: string;
          trigger_name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          trigger_category: string;
          trigger_name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          trigger_category?: string;
          trigger_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          child_name: string | null;
          color_code: string | null;
          created_at: string | null;
          description: string | null;
          end_time: string | null;
          event_date: string;
          event_title: string;
          event_type: string;
          icon_name: string | null;
          id: string;
          image_url: string | null;
          is_recurring: boolean | null;
          location: string | null;
          recurrence_pattern: string | null;
          reminder_minutes_before: number | null;
          start_time: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          child_name?: string | null;
          color_code?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_time?: string | null;
          event_date: string;
          event_title: string;
          event_type: string;
          icon_name?: string | null;
          id?: string;
          image_url?: string | null;
          is_recurring?: boolean | null;
          location?: string | null;
          recurrence_pattern?: string | null;
          reminder_minutes_before?: number | null;
          start_time?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          child_name?: string | null;
          color_code?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_time?: string | null;
          event_date?: string;
          event_title?: string;
          event_type?: string;
          icon_name?: string | null;
          id?: string;
          image_url?: string | null;
          is_recurring?: boolean | null;
          location?: string | null;
          recurrence_pattern?: string | null;
          reminder_minutes_before?: number | null;
          start_time?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      calming_strategies: {
        Row: {
          child_name: string;
          created_at: string | null;
          description: string;
          duration_minutes: number | null;
          effectiveness_rating: number | null;
          id: string;
          image_url: string | null;
          instructions: string[] | null;
          materials_needed: string[] | null;
          strategy_name: string;
          strategy_type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          child_name: string;
          created_at?: string | null;
          description: string;
          duration_minutes?: number | null;
          effectiveness_rating?: number | null;
          id?: string;
          image_url?: string | null;
          instructions?: string[] | null;
          materials_needed?: string[] | null;
          strategy_name: string;
          strategy_type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          child_name?: string;
          created_at?: string | null;
          description?: string;
          duration_minutes?: number | null;
          effectiveness_rating?: number | null;
          id?: string;
          image_url?: string | null;
          instructions?: string[] | null;
          materials_needed?: string[] | null;
          strategy_name?: string;
          strategy_type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      celebration_milestones: {
        Row: {
          celebration_count: number | null;
          child_profile_id: string | null;
          created_at: string | null;
          date_achieved: string | null;
          description: string | null;
          id: string;
          milestone_type: string;
          photo_url: string | null;
          shared_with_community: boolean | null;
          title: string;
          user_id: string;
        };
        Insert: {
          celebration_count?: number | null;
          child_profile_id?: string | null;
          created_at?: string | null;
          date_achieved?: string | null;
          description?: string | null;
          id?: string;
          milestone_type: string;
          photo_url?: string | null;
          shared_with_community?: boolean | null;
          title: string;
          user_id: string;
        };
        Update: {
          celebration_count?: number | null;
          child_profile_id?: string | null;
          created_at?: string | null;
          date_achieved?: string | null;
          description?: string | null;
          id?: string;
          milestone_type?: string;
          photo_url?: string | null;
          shared_with_community?: boolean | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      child_milestone_tracking: {
        Row: {
          achieved: boolean | null;
          achieved_date: string | null;
          age_achieved_months: number | null;
          category_id: string;
          celebration_note: string | null;
          child_birth_date: string;
          child_name: string;
          created_at: string | null;
          custom_milestone_description: string | null;
          custom_milestone_name: string | null;
          id: string;
          notes: string | null;
          typical_milestone_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          achieved?: boolean | null;
          achieved_date?: string | null;
          age_achieved_months?: number | null;
          category_id: string;
          celebration_note?: string | null;
          child_birth_date: string;
          child_name: string;
          created_at?: string | null;
          custom_milestone_description?: string | null;
          custom_milestone_name?: string | null;
          id?: string;
          notes?: string | null;
          typical_milestone_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          achieved?: boolean | null;
          achieved_date?: string | null;
          age_achieved_months?: number | null;
          category_id?: string;
          celebration_note?: string | null;
          child_birth_date?: string;
          child_name?: string;
          created_at?: string | null;
          custom_milestone_description?: string | null;
          custom_milestone_name?: string | null;
          id?: string;
          notes?: string | null;
          typical_milestone_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "child_milestone_tracking_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "milestone_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_milestone_tracking_typical_milestone_id_fkey";
            columns: ["typical_milestone_id"];
            isOneToOne: false;
            referencedRelation: "typical_milestones";
            referencedColumns: ["id"];
          },
        ];
      };
      children: {
        Row: {
          child_name: string;
          created_at: string | null;
          date_of_birth: string | null;
          id: string;
          notes: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          child_name: string;
          created_at?: string | null;
          date_of_birth?: string | null;
          id?: string;
          notes?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          child_name?: string;
          created_at?: string | null;
          date_of_birth?: string | null;
          id?: string;
          notes?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "children_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      community_blocked_users: {
        Row: {
          blocked_user_id: string;
          created_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          blocked_user_id: string;
          created_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          blocked_user_id?: string;
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      community_comments: {
        Row: {
          author_name: string;
          content: string;
          created_at: string | null;
          id: string;
          is_anonymous: boolean | null;
          likes_count: number | null;
          parent_comment_id: string | null;
          post_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          author_name: string;
          content: string;
          created_at?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          likes_count?: number | null;
          parent_comment_id?: string | null;
          post_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          author_name?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          likes_count?: number | null;
          parent_comment_id?: string | null;
          post_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey";
            columns: ["parent_comment_id"];
            isOneToOne: false;
            referencedRelation: "community_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_content_flags: {
        Row: {
          auto_action: string | null;
          confidence_score: number | null;
          content_id: string;
          content_type: string;
          created_at: string | null;
          flag_type: string;
          flagged_text: string | null;
          id: string;
          reviewed: boolean | null;
        };
        Insert: {
          auto_action?: string | null;
          confidence_score?: number | null;
          content_id: string;
          content_type: string;
          created_at?: string | null;
          flag_type: string;
          flagged_text?: string | null;
          id?: string;
          reviewed?: boolean | null;
        };
        Update: {
          auto_action?: string | null;
          confidence_score?: number | null;
          content_id?: string;
          content_type?: string;
          created_at?: string | null;
          flag_type?: string;
          flagged_text?: string | null;
          id?: string;
          reviewed?: boolean | null;
        };
        Relationships: [];
      };
      community_expert_amas: {
        Row: {
          created_at: string | null;
          description: string;
          duration_minutes: number | null;
          expert_id: string;
          id: string;
          is_live: boolean | null;
          participant_count: number | null;
          scheduled_for: string;
          specialty: string;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          duration_minutes?: number | null;
          expert_id: string;
          id?: string;
          is_live?: boolean | null;
          participant_count?: number | null;
          scheduled_for: string;
          specialty: string;
          title: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          duration_minutes?: number | null;
          expert_id?: string;
          id?: string;
          is_live?: boolean | null;
          participant_count?: number | null;
          scheduled_for?: string;
          specialty?: string;
          title?: string;
        };
        Relationships: [];
      };
      community_group_members: {
        Row: {
          group_id: string;
          id: string;
          joined_at: string | null;
          role: string | null;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          joined_at?: string | null;
          role?: string | null;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          joined_at?: string | null;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "community_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      community_groups: {
        Row: {
          age_range: string | null;
          condition_id: string | null;
          created_at: string | null;
          created_by: string | null;
          description: string;
          group_type: string;
          id: string;
          is_private: boolean | null;
          location: string | null;
          member_count: number | null;
          name: string;
          requires_approval: boolean | null;
        };
        Insert: {
          age_range?: string | null;
          condition_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description: string;
          group_type: string;
          id?: string;
          is_private?: boolean | null;
          location?: string | null;
          member_count?: number | null;
          name: string;
          requires_approval?: boolean | null;
        };
        Update: {
          age_range?: string | null;
          condition_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string;
          group_type?: string;
          id?: string;
          is_private?: boolean | null;
          location?: string | null;
          member_count?: number | null;
          name?: string;
          requires_approval?: boolean | null;
        };
        Relationships: [];
      };
      community_likes: {
        Row: {
          comment_id: string | null;
          created_at: string | null;
          id: string;
          post_id: string | null;
          user_id: string;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string | null;
          id?: string;
          post_id?: string | null;
          user_id: string;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string | null;
          id?: string;
          post_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_likes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "community_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_moderation_reports: {
        Row: {
          content_id: string;
          content_type: string;
          created_at: string | null;
          description: string | null;
          id: string;
          reason: string;
          reporter_id: string;
          resolution_notes: string | null;
          resolved_at: string | null;
          reviewed_by: string | null;
          status: string | null;
        };
        Insert: {
          content_id: string;
          content_type: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason: string;
          reporter_id: string;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
        };
        Update: {
          content_id?: string;
          content_type?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          reason?: string;
          reporter_id?: string;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          reviewed_by?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      community_moderators: {
        Row: {
          created_at: string | null;
          credentials: string | null;
          id: string;
          is_professional: boolean | null;
          permissions: Json | null;
          specialty: string | null;
          user_id: string;
          verified_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          credentials?: string | null;
          id?: string;
          is_professional?: boolean | null;
          permissions?: Json | null;
          specialty?: string | null;
          user_id: string;
          verified_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          credentials?: string | null;
          id?: string;
          is_professional?: boolean | null;
          permissions?: Json | null;
          specialty?: string | null;
          user_id?: string;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      community_posts: {
        Row: {
          author_name: string;
          category: string;
          comments_count: number | null;
          condition_tags: string[] | null;
          content: string;
          created_at: string | null;
          group_id: string | null;
          hidden_reason: string | null;
          id: string;
          is_anonymous: boolean | null;
          is_hidden: boolean | null;
          is_locked: boolean | null;
          is_pinned: boolean | null;
          likes_count: number | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          author_name: string;
          category: string;
          comments_count?: number | null;
          condition_tags?: string[] | null;
          content: string;
          created_at?: string | null;
          group_id?: string | null;
          hidden_reason?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          is_hidden?: boolean | null;
          is_locked?: boolean | null;
          is_pinned?: boolean | null;
          likes_count?: number | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          author_name?: string;
          category?: string;
          comments_count?: number | null;
          condition_tags?: string[] | null;
          content?: string;
          created_at?: string | null;
          group_id?: string | null;
          hidden_reason?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          is_hidden?: boolean | null;
          is_locked?: boolean | null;
          is_pinned?: boolean | null;
          likes_count?: number | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_posts_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "community_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      community_shared_resources: {
        Row: {
          age_appropriate: string[] | null;
          condition_tags: string[] | null;
          cost_info: string | null;
          created_at: string | null;
          description: string | null;
          email: string | null;
          id: string;
          is_verified: boolean | null;
          location: string | null;
          phone_number: string | null;
          rating: number | null;
          resource_type: string | null;
          review_count: number | null;
          title: string;
          url: string | null;
          user_id: string;
        };
        Insert: {
          age_appropriate?: string[] | null;
          condition_tags?: string[] | null;
          cost_info?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string | null;
          id?: string;
          is_verified?: boolean | null;
          location?: string | null;
          phone_number?: string | null;
          rating?: number | null;
          resource_type?: string | null;
          review_count?: number | null;
          title: string;
          url?: string | null;
          user_id: string;
        };
        Update: {
          age_appropriate?: string[] | null;
          condition_tags?: string[] | null;
          cost_info?: string | null;
          created_at?: string | null;
          description?: string | null;
          email?: string | null;
          id?: string;
          is_verified?: boolean | null;
          location?: string | null;
          phone_number?: string | null;
          rating?: number | null;
          resource_type?: string | null;
          review_count?: number | null;
          title?: string;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      conditions: {
        Row: {
          code: string;
          color: string;
          created_at: string;
          description_en: string;
          description_es: string;
          explanation_en: string | null;
          explanation_es: string | null;
          how_to_help_en: string | null;
          how_to_help_es: string | null;
          icon: string;
          id: string;
          is_active: boolean;
          name_en: string;
          name_es: string;
          order_index: number;
          what_parents_see_en: string | null;
          what_parents_see_es: string | null;
        };
        Insert: {
          code: string;
          color?: string;
          created_at?: string;
          description_en?: string;
          description_es?: string;
          explanation_en?: string | null;
          explanation_es?: string | null;
          how_to_help_en?: string | null;
          how_to_help_es?: string | null;
          icon?: string;
          id?: string;
          is_active?: boolean;
          name_en: string;
          name_es: string;
          order_index?: number;
          what_parents_see_en?: string | null;
          what_parents_see_es?: string | null;
        };
        Update: {
          code?: string;
          color?: string;
          created_at?: string;
          description_en?: string;
          description_es?: string;
          explanation_en?: string | null;
          explanation_es?: string | null;
          how_to_help_en?: string | null;
          how_to_help_es?: string | null;
          icon?: string;
          id?: string;
          is_active?: boolean;
          name_en?: string;
          name_es?: string;
          order_index?: number;
          what_parents_see_en?: string | null;
          what_parents_see_es?: string | null;
        };
        Relationships: [];
      };
      crisis_contacts: {
        Row: {
          contact_name: string;
          contact_type: string;
          created_at: string | null;
          email: string | null;
          id: string;
          notes: string | null;
          phone_number: string;
          priority_order: number | null;
          relationship: string;
          user_id: string;
        };
        Insert: {
          contact_name: string;
          contact_type: string;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          notes?: string | null;
          phone_number: string;
          priority_order?: number | null;
          relationship: string;
          user_id: string;
        };
        Update: {
          contact_name?: string;
          contact_type?: string;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          notes?: string | null;
          phone_number?: string;
          priority_order?: number | null;
          relationship?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      crisis_plans: {
        Row: {
          additional_notes: string | null;
          child_name: string;
          created_at: string | null;
          id: string;
          immediate_actions: string[] | null;
          medication_instructions: string | null;
          safe_space_location: string | null;
          things_to_avoid: string[] | null;
          updated_at: string | null;
          user_id: string;
          warning_signs: string[] | null;
          when_to_call_911: string[] | null;
        };
        Insert: {
          additional_notes?: string | null;
          child_name: string;
          created_at?: string | null;
          id?: string;
          immediate_actions?: string[] | null;
          medication_instructions?: string | null;
          safe_space_location?: string | null;
          things_to_avoid?: string[] | null;
          updated_at?: string | null;
          user_id: string;
          warning_signs?: string[] | null;
          when_to_call_911?: string[] | null;
        };
        Update: {
          additional_notes?: string | null;
          child_name?: string;
          created_at?: string | null;
          id?: string;
          immediate_actions?: string[] | null;
          medication_instructions?: string | null;
          safe_space_location?: string | null;
          things_to_avoid?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
          warning_signs?: string[] | null;
          when_to_call_911?: string[] | null;
        };
        Relationships: [];
      };
      daily_routines: {
        Row: {
          child_name: string;
          color_code: string | null;
          created_at: string | null;
          display_order: number | null;
          estimated_duration_minutes: number | null;
          icon_name: string | null;
          id: string;
          is_active: boolean | null;
          routine_name: string;
          routine_type: string;
          time_of_day: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          child_name: string;
          color_code?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          estimated_duration_minutes?: number | null;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          routine_name: string;
          routine_type: string;
          time_of_day?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          child_name?: string;
          color_code?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          estimated_duration_minutes?: number | null;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          routine_name?: string;
          routine_type?: string;
          time_of_day?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_tips: {
        Row: {
          category: string;
          condition_id: string;
          created_at: string | null;
          description_en: string;
          description_es: string;
          difficulty: string;
          id: string;
          order_index: number;
          time_needed_minutes: number | null;
          title_en: string;
          title_es: string;
        };
        Insert: {
          category: string;
          condition_id: string;
          created_at?: string | null;
          description_en: string;
          description_es: string;
          difficulty?: string;
          id?: string;
          order_index?: number;
          time_needed_minutes?: number | null;
          title_en: string;
          title_es: string;
        };
        Update: {
          category?: string;
          condition_id?: string;
          created_at?: string | null;
          description_en?: string;
          description_es?: string;
          difficulty?: string;
          id?: string;
          order_index?: number;
          time_needed_minutes?: number | null;
          title_en?: string;
          title_es?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_tips_condition_id_fkey";
            columns: ["condition_id"];
            isOneToOne: false;
            referencedRelation: "conditions";
            referencedColumns: ["id"];
          },
        ];
      };
      emergency_cards: {
        Row: {
          allergies: string[] | null;
          calming_techniques: string[] | null;
          can_call_for_help: boolean | null;
          can_state_address: boolean | null;
          can_state_name: boolean | null;
          card_version: number | null;
          child_name: string;
          child_photo_url: string | null;
          common_triggers: string[] | null;
          communication_level: string;
          communication_methods: string[] | null;
          communication_notes: string | null;
          created_at: string | null;
          date_of_birth: string;
          dietary_restrictions: string[] | null;
          emergency_contact1_name: string | null;
          emergency_contact1_phone: string | null;
          emergency_contact1_relationship: string | null;
          emergency_contact2_name: string | null;
          emergency_contact2_phone: string | null;
          emergency_contact2_relationship: string | null;
          favorite_items: string[] | null;
          hospital_preference: string | null;
          id: string;
          is_active: boolean | null;
          last_updated: string | null;
          medical_conditions: string[] | null;
          medications: string[] | null;
          parent1_name: string | null;
          parent1_phone: string | null;
          parent1_relationship: string | null;
          parent2_name: string | null;
          parent2_phone: string | null;
          parent2_relationship: string | null;
          primary_diagnosis: string[] | null;
          primary_doctor_name: string | null;
          primary_doctor_phone: string | null;
          safe_spaces: string[] | null;
          sensory_sensitivities: string[] | null;
          special_instructions: string | null;
          therapist_name: string | null;
          therapist_phone: string | null;
          things_to_avoid: string[] | null;
          user_id: string;
          warning_signs: string[] | null;
        };
        Insert: {
          allergies?: string[] | null;
          calming_techniques?: string[] | null;
          can_call_for_help?: boolean | null;
          can_state_address?: boolean | null;
          can_state_name?: boolean | null;
          card_version?: number | null;
          child_name: string;
          child_photo_url?: string | null;
          common_triggers?: string[] | null;
          communication_level: string;
          communication_methods?: string[] | null;
          communication_notes?: string | null;
          created_at?: string | null;
          date_of_birth: string;
          dietary_restrictions?: string[] | null;
          emergency_contact1_name?: string | null;
          emergency_contact1_phone?: string | null;
          emergency_contact1_relationship?: string | null;
          emergency_contact2_name?: string | null;
          emergency_contact2_phone?: string | null;
          emergency_contact2_relationship?: string | null;
          favorite_items?: string[] | null;
          hospital_preference?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_updated?: string | null;
          medical_conditions?: string[] | null;
          medications?: string[] | null;
          parent1_name?: string | null;
          parent1_phone?: string | null;
          parent1_relationship?: string | null;
          parent2_name?: string | null;
          parent2_phone?: string | null;
          parent2_relationship?: string | null;
          primary_diagnosis?: string[] | null;
          primary_doctor_name?: string | null;
          primary_doctor_phone?: string | null;
          safe_spaces?: string[] | null;
          sensory_sensitivities?: string[] | null;
          special_instructions?: string | null;
          therapist_name?: string | null;
          therapist_phone?: string | null;
          things_to_avoid?: string[] | null;
          user_id: string;
          warning_signs?: string[] | null;
        };
        Update: {
          allergies?: string[] | null;
          calming_techniques?: string[] | null;
          can_call_for_help?: boolean | null;
          can_state_address?: boolean | null;
          can_state_name?: boolean | null;
          card_version?: number | null;
          child_name?: string;
          child_photo_url?: string | null;
          common_triggers?: string[] | null;
          communication_level?: string;
          communication_methods?: string[] | null;
          communication_notes?: string | null;
          created_at?: string | null;
          date_of_birth?: string;
          dietary_restrictions?: string[] | null;
          emergency_contact1_name?: string | null;
          emergency_contact1_phone?: string | null;
          emergency_contact1_relationship?: string | null;
          emergency_contact2_name?: string | null;
          emergency_contact2_phone?: string | null;
          emergency_contact2_relationship?: string | null;
          favorite_items?: string[] | null;
          hospital_preference?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_updated?: string | null;
          medical_conditions?: string[] | null;
          medications?: string[] | null;
          parent1_name?: string | null;
          parent1_phone?: string | null;
          parent1_relationship?: string | null;
          parent2_name?: string | null;
          parent2_phone?: string | null;
          parent2_relationship?: string | null;
          primary_diagnosis?: string[] | null;
          primary_doctor_name?: string | null;
          primary_doctor_phone?: string | null;
          safe_spaces?: string[] | null;
          sensory_sensitivities?: string[] | null;
          special_instructions?: string | null;
          therapist_name?: string | null;
          therapist_phone?: string | null;
          things_to_avoid?: string[] | null;
          user_id?: string;
          warning_signs?: string[] | null;
        };
        Relationships: [];
      };
      emergency_protocols: {
        Row: {
          card_id: string;
          created_at: string | null;
          id: string;
          important_notes: string | null;
          protocol_title: string;
          situation_type: string;
          steps: string[];
          when_to_call_911: string[] | null;
        };
        Insert: {
          card_id: string;
          created_at?: string | null;
          id?: string;
          important_notes?: string | null;
          protocol_title: string;
          situation_type: string;
          steps: string[];
          when_to_call_911?: string[] | null;
        };
        Update: {
          card_id?: string;
          created_at?: string | null;
          id?: string;
          important_notes?: string | null;
          protocol_title?: string;
          situation_type?: string;
          steps?: string[];
          when_to_call_911?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_protocols_card_id_fkey";
            columns: ["card_id"];
            isOneToOne: false;
            referencedRelation: "emergency_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      functional_domains: {
        Row: {
          code: string;
          created_at: string;
          description_en: string;
          description_es: string;
          id: string;
          name_en: string;
          name_es: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description_en?: string;
          description_es?: string;
          id?: string;
          name_en: string;
          name_es: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description_en?: string;
          description_es?: string;
          id?: string;
          name_en?: string;
          name_es?: string;
        };
        Relationships: [];
      };
      general_developmental_questions: {
        Row: {
          age_range_max: number;
          age_range_min: number;
          created_at: string | null;
          domain: string;
          explanation: string | null;
          explanation_es: string | null;
          id: string;
          question_number: number;
          question_text: string;
          question_text_es: string | null;
          response_options: NonNullable<Json>;
          response_type: string | null;
          scoring_weight: number | null;
        };
        Insert: {
          age_range_max: number;
          age_range_min: number;
          created_at?: string | null;
          domain: string;
          explanation?: string | null;
          explanation_es?: string | null;
          id?: string;
          question_number: number;
          question_text: string;
          question_text_es?: string | null;
          response_options: NonNullable<Json>;
          response_type?: string | null;
          scoring_weight?: number | null;
        };
        Update: {
          age_range_max?: number;
          age_range_min?: number;
          created_at?: string | null;
          domain?: string;
          explanation?: string | null;
          explanation_es?: string | null;
          id?: string;
          question_number?: number;
          question_text?: string;
          question_text_es?: string | null;
          response_options?: NonNullable<Json>;
          response_type?: string | null;
          scoring_weight?: number | null;
        };
        Relationships: [];
      };
      general_screening_domain_scores: {
        Row: {
          concern_level: string | null;
          created_at: string | null;
          domain: string;
          id: string;
          max_possible_score: number;
          percentage_score: number;
          raw_score: number;
          session_id: string;
          user_id: string;
        };
        Insert: {
          concern_level?: string | null;
          created_at?: string | null;
          domain: string;
          id?: string;
          max_possible_score: number;
          percentage_score: number;
          raw_score: number;
          session_id: string;
          user_id: string;
        };
        Update: {
          concern_level?: string | null;
          created_at?: string | null;
          domain?: string;
          id?: string;
          max_possible_score?: number;
          percentage_score?: number;
          raw_score?: number;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      general_screening_recommendations: {
        Row: {
          accepted: boolean | null;
          confidence_level: string | null;
          created_at: string | null;
          domain_triggers: string[] | null;
          educational_content: string | null;
          educational_content_es: string | null;
          id: string;
          parent_message: string;
          parent_message_es: string | null;
          priority_order: number | null;
          professional_guidance: string;
          reasoning: NonNullable<Json>;
          recommended_condition: string;
          session_id: string;
          user_id: string;
          viewed: boolean | null;
        };
        Insert: {
          accepted?: boolean | null;
          confidence_level?: string | null;
          created_at?: string | null;
          domain_triggers?: string[] | null;
          educational_content?: string | null;
          educational_content_es?: string | null;
          id?: string;
          parent_message: string;
          parent_message_es?: string | null;
          priority_order?: number | null;
          professional_guidance: string;
          reasoning: NonNullable<Json>;
          recommended_condition: string;
          session_id: string;
          user_id: string;
          viewed?: boolean | null;
        };
        Update: {
          accepted?: boolean | null;
          confidence_level?: string | null;
          created_at?: string | null;
          domain_triggers?: string[] | null;
          educational_content?: string | null;
          educational_content_es?: string | null;
          id?: string;
          parent_message?: string;
          parent_message_es?: string | null;
          priority_order?: number | null;
          professional_guidance?: string;
          reasoning?: NonNullable<Json>;
          recommended_condition?: string;
          session_id?: string;
          user_id?: string;
          viewed?: boolean | null;
        };
        Relationships: [];
      };
      general_screening_responses: {
        Row: {
          child_age_months: number;
          created_at: string | null;
          id: string;
          notes: string | null;
          question_id: string;
          response_score: number | null;
          response_value: string;
          session_id: string;
          user_id: string;
        };
        Insert: {
          child_age_months: number;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          question_id: string;
          response_score?: number | null;
          response_value: string;
          session_id: string;
          user_id: string;
        };
        Update: {
          child_age_months?: number;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          question_id?: string;
          response_score?: number | null;
          response_value?: string;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "general_screening_responses_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "general_developmental_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      generated_reports: {
        Row: {
          date_range_end: string;
          date_range_start: string;
          generated_at: string | null;
          id: string;
          notes: string | null;
          report_data: Json | null;
          report_type: string;
          template_id: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          date_range_end: string;
          date_range_start: string;
          generated_at?: string | null;
          id?: string;
          notes?: string | null;
          report_data?: Json | null;
          report_type: string;
          template_id?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          date_range_end?: string;
          date_range_start?: string;
          generated_at?: string | null;
          id?: string;
          notes?: string | null;
          report_data?: Json | null;
          report_type?: string;
          template_id?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "report_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      goal_progress_logs: {
        Row: {
          goal_id: string;
          id: string;
          logged_at: string | null;
          notes: string | null;
          user_id: string;
          value: number;
        };
        Insert: {
          goal_id: string;
          id?: string;
          logged_at?: string | null;
          notes?: string | null;
          user_id: string;
          value: number;
        };
        Update: {
          goal_id?: string;
          id?: string;
          logged_at?: string | null;
          notes?: string | null;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "goal_progress_logs_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          category: string;
          child_name: string;
          completed_at: string | null;
          created_at: string | null;
          current_value: number;
          description: string | null;
          id: string;
          linked_condition: string | null;
          notes: string | null;
          priority: string;
          status: string;
          target_date: string | null;
          target_value: number;
          title: string;
          unit: string;
          user_id: string;
        };
        Insert: {
          category: string;
          child_name: string;
          completed_at?: string | null;
          created_at?: string | null;
          current_value?: number;
          description?: string | null;
          id?: string;
          linked_condition?: string | null;
          notes?: string | null;
          priority?: string;
          status?: string;
          target_date?: string | null;
          target_value?: number;
          title: string;
          unit?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          child_name?: string;
          completed_at?: string | null;
          created_at?: string | null;
          current_value?: number;
          description?: string | null;
          id?: string;
          linked_condition?: string | null;
          notes?: string | null;
          priority?: string;
          status?: string;
          target_date?: string | null;
          target_value?: number;
          title?: string;
          unit?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      iep_accommodations: {
        Row: {
          accommodation_type: string;
          category: string;
          created_at: string | null;
          description: string;
          frequency: string | null;
          id: string;
          is_active: boolean | null;
          notes: string | null;
          plan_id: string;
          who_implements: string | null;
        };
        Insert: {
          accommodation_type: string;
          category: string;
          created_at?: string | null;
          description: string;
          frequency?: string | null;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          plan_id: string;
          who_implements?: string | null;
        };
        Update: {
          accommodation_type?: string;
          category?: string;
          created_at?: string | null;
          description?: string;
          frequency?: string | null;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          plan_id?: string;
          who_implements?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "iep_accommodations_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "iep_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      iep_contacts: {
        Row: {
          best_contact_method: string | null;
          contact_name: string;
          created_at: string | null;
          department: string | null;
          email: string | null;
          id: string;
          notes: string | null;
          phone: string | null;
          plan_id: string;
          role: string;
        };
        Insert: {
          best_contact_method?: string | null;
          contact_name: string;
          created_at?: string | null;
          department?: string | null;
          email?: string | null;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          plan_id: string;
          role: string;
        };
        Update: {
          best_contact_method?: string | null;
          contact_name?: string;
          created_at?: string | null;
          department?: string | null;
          email?: string | null;
          id?: string;
          notes?: string | null;
          phone?: string | null;
          plan_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "iep_contacts_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "iep_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      iep_goals: {
        Row: {
          baseline: string | null;
          created_at: string | null;
          current_progress: string | null;
          goal_area: string;
          goal_number: string | null;
          goal_text: string;
          id: string;
          is_mastered: boolean | null;
          notes: string | null;
          plan_id: string;
          progress_monitoring_method: string | null;
          progress_percentage: number | null;
          target_criteria: string;
          target_date: string | null;
          updated_at: string | null;
        };
        Insert: {
          baseline?: string | null;
          created_at?: string | null;
          current_progress?: string | null;
          goal_area: string;
          goal_number?: string | null;
          goal_text: string;
          id?: string;
          is_mastered?: boolean | null;
          notes?: string | null;
          plan_id: string;
          progress_monitoring_method?: string | null;
          progress_percentage?: number | null;
          target_criteria: string;
          target_date?: string | null;
          updated_at?: string | null;
        };
        Update: {
          baseline?: string | null;
          created_at?: string | null;
          current_progress?: string | null;
          goal_area?: string;
          goal_number?: string | null;
          goal_text?: string;
          id?: string;
          is_mastered?: boolean | null;
          notes?: string | null;
          plan_id?: string;
          progress_monitoring_method?: string | null;
          progress_percentage?: number | null;
          target_criteria?: string;
          target_date?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "iep_goals_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "iep_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      iep_meetings: {
        Row: {
          action_items: string[] | null;
          attendees: string[] | null;
          created_at: string | null;
          decisions_made: string[] | null;
          id: string;
          location: string | null;
          meeting_date: string;
          meeting_time: string | null;
          meeting_type: string;
          next_meeting_date: string | null;
          notes: string | null;
          parent_concerns: string | null;
          plan_id: string;
          topics_discussed: string[] | null;
        };
        Insert: {
          action_items?: string[] | null;
          attendees?: string[] | null;
          created_at?: string | null;
          decisions_made?: string[] | null;
          id?: string;
          location?: string | null;
          meeting_date: string;
          meeting_time?: string | null;
          meeting_type: string;
          next_meeting_date?: string | null;
          notes?: string | null;
          parent_concerns?: string | null;
          plan_id: string;
          topics_discussed?: string[] | null;
        };
        Update: {
          action_items?: string[] | null;
          attendees?: string[] | null;
          created_at?: string | null;
          decisions_made?: string[] | null;
          id?: string;
          location?: string | null;
          meeting_date?: string;
          meeting_time?: string | null;
          meeting_type?: string;
          next_meeting_date?: string | null;
          notes?: string | null;
          parent_concerns?: string | null;
          plan_id?: string;
          topics_discussed?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "iep_meetings_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "iep_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      iep_plans: {
        Row: {
          case_manager_email: string | null;
          case_manager_name: string | null;
          case_manager_phone: string | null;
          child_name: string;
          created_at: string | null;
          end_date: string;
          grade_level: string | null;
          id: string;
          notes: string | null;
          placement: string | null;
          plan_type: string;
          primary_disability: string | null;
          review_date: string | null;
          school_name: string;
          secondary_disabilities: string[] | null;
          service_minutes_per_week: number | null;
          start_date: string;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          case_manager_email?: string | null;
          case_manager_name?: string | null;
          case_manager_phone?: string | null;
          child_name: string;
          created_at?: string | null;
          end_date: string;
          grade_level?: string | null;
          id?: string;
          notes?: string | null;
          placement?: string | null;
          plan_type: string;
          primary_disability?: string | null;
          review_date?: string | null;
          school_name: string;
          secondary_disabilities?: string[] | null;
          service_minutes_per_week?: number | null;
          start_date: string;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          case_manager_email?: string | null;
          case_manager_name?: string | null;
          case_manager_phone?: string | null;
          child_name?: string;
          created_at?: string | null;
          end_date?: string;
          grade_level?: string | null;
          id?: string;
          notes?: string | null;
          placement?: string | null;
          plan_type?: string;
          primary_disability?: string | null;
          review_date?: string | null;
          school_name?: string;
          secondary_disabilities?: string[] | null;
          service_minutes_per_week?: number | null;
          start_date?: string;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      insurance_providers: {
        Row: {
          created_at: string | null;
          id: string;
          phone_number: string | null;
          provider_name: string;
          provider_type: string;
          website_url: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          phone_number?: string | null;
          provider_name: string;
          provider_type: string;
          website_url?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          phone_number?: string | null;
          provider_name?: string;
          provider_type?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      learning_pathways: {
        Row: {
          age_range: string | null;
          condition_id: string | null;
          created_at: string | null;
          difficulty_level: string | null;
          estimated_hours: number | null;
          id: string;
          modules: NonNullable<Json>;
          pathway_description: string;
          pathway_name: string;
        };
        Insert: {
          age_range?: string | null;
          condition_id?: string | null;
          created_at?: string | null;
          difficulty_level?: string | null;
          estimated_hours?: number | null;
          id?: string;
          modules: NonNullable<Json>;
          pathway_description: string;
          pathway_name: string;
        };
        Update: {
          age_range?: string | null;
          condition_id?: string | null;
          created_at?: string | null;
          difficulty_level?: string | null;
          estimated_hours?: number | null;
          id?: string;
          modules?: NonNullable<Json>;
          pathway_description?: string;
          pathway_name?: string;
        };
        Relationships: [];
      };
      medication_logs: {
        Row: {
          behavioral_changes: string | null;
          id: string;
          logged_at: string | null;
          medication_id: string;
          notes: string | null;
          scheduled_time: string | null;
          side_effects_observed: string | null;
          status: string;
          taken_at: string;
          user_id: string;
        };
        Insert: {
          behavioral_changes?: string | null;
          id?: string;
          logged_at?: string | null;
          medication_id: string;
          notes?: string | null;
          scheduled_time?: string | null;
          side_effects_observed?: string | null;
          status?: string;
          taken_at: string;
          user_id: string;
        };
        Update: {
          behavioral_changes?: string | null;
          id?: string;
          logged_at?: string | null;
          medication_id?: string;
          notes?: string | null;
          scheduled_time?: string | null;
          side_effects_observed?: string | null;
          status?: string;
          taken_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey";
            columns: ["medication_id"];
            isOneToOne: false;
            referencedRelation: "medications";
            referencedColumns: ["id"];
          },
        ];
      };
      medications: {
        Row: {
          active: boolean | null;
          child_name: string;
          created_at: string | null;
          dosage: string;
          end_date: string | null;
          frequency: string;
          id: string;
          linked_condition: string | null;
          name: string;
          notes: string | null;
          prescribing_doctor: string | null;
          purpose: string | null;
          schedule_times: string[] | null;
          side_effects: string | null;
          start_date: string | null;
          type: string;
          user_id: string;
        };
        Insert: {
          active?: boolean | null;
          child_name: string;
          created_at?: string | null;
          dosage: string;
          end_date?: string | null;
          frequency: string;
          id?: string;
          linked_condition?: string | null;
          name: string;
          notes?: string | null;
          prescribing_doctor?: string | null;
          purpose?: string | null;
          schedule_times?: string[] | null;
          side_effects?: string | null;
          start_date?: string | null;
          type?: string;
          user_id: string;
        };
        Update: {
          active?: boolean | null;
          child_name?: string;
          created_at?: string | null;
          dosage?: string;
          end_date?: string | null;
          frequency?: string;
          id?: string;
          linked_condition?: string | null;
          name?: string;
          notes?: string | null;
          prescribing_doctor?: string | null;
          purpose?: string | null;
          schedule_times?: string[] | null;
          side_effects?: string | null;
          start_date?: string | null;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      milestone_categories: {
        Row: {
          category_description: string | null;
          category_name: string;
          color_code: string | null;
          created_at: string | null;
          display_order: number | null;
          icon_name: string | null;
          id: string;
        };
        Insert: {
          category_description?: string | null;
          category_name: string;
          color_code?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          icon_name?: string | null;
          id?: string;
        };
        Update: {
          category_description?: string | null;
          category_name?: string;
          color_code?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          icon_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      notification_history: {
        Row: {
          id: string;
          message: string | null;
          notification_type: string;
          read_at: string | null;
          reminder_id: string | null;
          sent_at: string | null;
          title: string;
          user_id: string;
          was_read: boolean | null;
        };
        Insert: {
          id?: string;
          message?: string | null;
          notification_type: string;
          read_at?: string | null;
          reminder_id?: string | null;
          sent_at?: string | null;
          title: string;
          user_id: string;
          was_read?: boolean | null;
        };
        Update: {
          id?: string;
          message?: string | null;
          notification_type?: string;
          read_at?: string | null;
          reminder_id?: string | null;
          sent_at?: string | null;
          title?: string;
          user_id?: string;
          was_read?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "notification_history_reminder_id_fkey";
            columns: ["reminder_id"];
            isOneToOne: false;
            referencedRelation: "reminders";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_preferences: {
        Row: {
          appointment_reminders: boolean | null;
          created_at: string | null;
          email_notifications: boolean | null;
          goal_reminders: boolean | null;
          id: string;
          medication_reminders: boolean | null;
          push_notifications: boolean | null;
          quiet_hours_end: string | null;
          quiet_hours_start: string | null;
          reminder_advance_minutes: number | null;
          therapy_reminders: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          appointment_reminders?: boolean | null;
          created_at?: string | null;
          email_notifications?: boolean | null;
          goal_reminders?: boolean | null;
          id?: string;
          medication_reminders?: boolean | null;
          push_notifications?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          reminder_advance_minutes?: number | null;
          therapy_reminders?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          appointment_reminders?: boolean | null;
          created_at?: string | null;
          email_notifications?: boolean | null;
          goal_reminders?: boolean | null;
          id?: string;
          medication_reminders?: boolean | null;
          push_notifications?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          reminder_advance_minutes?: number | null;
          therapy_reminders?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      parent_emotional_checkins: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          mood_rating: number;
          needs_support: boolean | null;
          notes: string | null;
          self_care_activities: string[] | null;
          sleep_quality: number | null;
          stress_level: number;
          support_feeling: number | null;
          triggers: string[] | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          date?: string;
          id?: string;
          mood_rating: number;
          needs_support?: boolean | null;
          notes?: string | null;
          self_care_activities?: string[] | null;
          sleep_quality?: number | null;
          stress_level: number;
          support_feeling?: number | null;
          triggers?: string[] | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          mood_rating?: number;
          needs_support?: boolean | null;
          notes?: string | null;
          self_care_activities?: string[] | null;
          sleep_quality?: number | null;
          stress_level?: number;
          support_feeling?: number | null;
          triggers?: string[] | null;
          user_id?: string;
        };
        Relationships: [];
      };
      parent_mentor_profiles: {
        Row: {
          bio: string | null;
          child_age_ranges: string[] | null;
          child_conditions: string[];
          created_at: string | null;
          current_mentees: number | null;
          expertise_areas: string[];
          id: string;
          is_available: boolean | null;
          languages: string[] | null;
          max_mentees: number | null;
          rating: number | null;
          total_mentored: number | null;
          user_id: string;
          verified_at: string | null;
          years_experience: number | null;
        };
        Insert: {
          bio?: string | null;
          child_age_ranges?: string[] | null;
          child_conditions: string[];
          created_at?: string | null;
          current_mentees?: number | null;
          expertise_areas: string[];
          id?: string;
          is_available?: boolean | null;
          languages?: string[] | null;
          max_mentees?: number | null;
          rating?: number | null;
          total_mentored?: number | null;
          user_id: string;
          verified_at?: string | null;
          years_experience?: number | null;
        };
        Update: {
          bio?: string | null;
          child_age_ranges?: string[] | null;
          child_conditions?: string[];
          created_at?: string | null;
          current_mentees?: number | null;
          expertise_areas?: string[];
          id?: string;
          is_available?: boolean | null;
          languages?: string[] | null;
          max_mentees?: number | null;
          rating?: number | null;
          total_mentored?: number | null;
          user_id?: string;
          verified_at?: string | null;
          years_experience?: number | null;
        };
        Relationships: [];
      };
      parent_mentorship_matches: {
        Row: {
          condition_focus: string[] | null;
          created_at: string | null;
          first_contact_at: string | null;
          id: string;
          last_contact_at: string | null;
          match_score: number | null;
          match_status: string | null;
          mentee_id: string;
          mentee_needs: string[] | null;
          mentor_expertise: string[] | null;
          mentor_id: string;
          total_interactions: number | null;
        };
        Insert: {
          condition_focus?: string[] | null;
          created_at?: string | null;
          first_contact_at?: string | null;
          id?: string;
          last_contact_at?: string | null;
          match_score?: number | null;
          match_status?: string | null;
          mentee_id: string;
          mentee_needs?: string[] | null;
          mentor_expertise?: string[] | null;
          mentor_id: string;
          total_interactions?: number | null;
        };
        Update: {
          condition_focus?: string[] | null;
          created_at?: string | null;
          first_contact_at?: string | null;
          id?: string;
          last_contact_at?: string | null;
          match_score?: number | null;
          match_status?: string | null;
          mentee_id?: string;
          mentee_needs?: string[] | null;
          mentor_expertise?: string[] | null;
          mentor_id?: string;
          total_interactions?: number | null;
        };
        Relationships: [];
      };
      parent_skill_badges: {
        Row: {
          badge_category: string | null;
          badge_description: string;
          badge_icon: string | null;
          badge_name: string;
          created_at: string | null;
          id: string;
          points_value: number | null;
          unlock_criteria: NonNullable<Json>;
        };
        Insert: {
          badge_category?: string | null;
          badge_description: string;
          badge_icon?: string | null;
          badge_name: string;
          created_at?: string | null;
          id?: string;
          points_value?: number | null;
          unlock_criteria: NonNullable<Json>;
        };
        Update: {
          badge_category?: string | null;
          badge_description?: string;
          badge_icon?: string | null;
          badge_name?: string;
          created_at?: string | null;
          id?: string;
          points_value?: number | null;
          unlock_criteria?: NonNullable<Json>;
        };
        Relationships: [];
      };
      parent_support_resources: {
        Row: {
          created_at: string | null;
          description: string;
          id: string;
          is_crisis: boolean | null;
          language: string | null;
          mood_range: number[] | null;
          phone_number: string | null;
          resource_type: string;
          stress_range: number[] | null;
          title: string;
          trigger_conditions: Json | null;
          url: string | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          id?: string;
          is_crisis?: boolean | null;
          language?: string | null;
          mood_range?: number[] | null;
          phone_number?: string | null;
          resource_type: string;
          stress_range?: number[] | null;
          title: string;
          trigger_conditions?: Json | null;
          url?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          id?: string;
          is_crisis?: boolean | null;
          language?: string | null;
          mood_range?: number[] | null;
          phone_number?: string | null;
          resource_type?: string;
          stress_range?: number[] | null;
          title?: string;
          trigger_conditions?: Json | null;
          url?: string | null;
        };
        Relationships: [];
      };
      photo_journal_entries: {
        Row: {
          age_at_capture: string | null;
          child_name: string;
          created_at: string | null;
          description: string | null;
          id: string;
          linked_condition: string | null;
          linked_goal_id: string | null;
          media_type: string;
          milestone_type: string | null;
          photo_url: string;
          tags: string[] | null;
          title: string;
          user_id: string;
        };
        Insert: {
          age_at_capture?: string | null;
          child_name: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          linked_condition?: string | null;
          linked_goal_id?: string | null;
          media_type: string;
          milestone_type?: string | null;
          photo_url: string;
          tags?: string[] | null;
          title: string;
          user_id: string;
        };
        Update: {
          age_at_capture?: string | null;
          child_name?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          linked_condition?: string | null;
          linked_goal_id?: string | null;
          media_type?: string;
          milestone_type?: string | null;
          photo_url?: string;
          tags?: string[] | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      progress_entries: {
        Row: {
          category: string;
          child_id: string;
          created_at: string | null;
          entry_date: string | null;
          id: string;
          notes: string | null;
          score: number | null;
          user_id: string;
        };
        Insert: {
          category: string;
          child_id: string;
          created_at?: string | null;
          entry_date?: string | null;
          id?: string;
          notes?: string | null;
          score?: number | null;
          user_id: string;
        };
        Update: {
          category?: string;
          child_id?: string;
          created_at?: string | null;
          entry_date?: string | null;
          id?: string;
          notes?: string | null;
          score?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "progress_entries_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "progress_entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      progress_milestones: {
        Row: {
          achieved: boolean | null;
          achieved_date: string | null;
          created_at: string | null;
          id: string;
          milestone_text: string;
          session_id: string | null;
          user_id: string | null;
        };
        Insert: {
          achieved?: boolean | null;
          achieved_date?: string | null;
          created_at?: string | null;
          id?: string;
          milestone_text: string;
          session_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          achieved?: boolean | null;
          achieved_date?: string | null;
          created_at?: string | null;
          id?: string;
          milestone_text?: string;
          session_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "progress_milestones_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "screening_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      question_domains: {
        Row: {
          domain_id: string;
          question_id: string;
        };
        Insert: {
          domain_id: string;
          question_id: string;
        };
        Update: {
          domain_id?: string;
          question_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "question_domains_domain_id_fkey";
            columns: ["domain_id"];
            isOneToOne: false;
            referencedRelation: "functional_domains";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "question_domains_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          age_max_months: number;
          age_min_months: number;
          condition_id: string;
          created_at: string;
          id: string;
          is_red_flag: boolean;
          order_index: number;
          question_en: string;
          question_es: string;
          weight: number;
        };
        Insert: {
          age_max_months?: number;
          age_min_months?: number;
          condition_id: string;
          created_at?: string;
          id?: string;
          is_red_flag?: boolean;
          order_index?: number;
          question_en: string;
          question_es: string;
          weight?: number;
        };
        Update: {
          age_max_months?: number;
          age_min_months?: number;
          condition_id?: string;
          created_at?: string;
          id?: string;
          is_red_flag?: boolean;
          order_index?: number;
          question_en?: string;
          question_es?: string;
          weight?: number;
        };
        Relationships: [
          {
            foreignKeyName: "questions_condition_id_fkey";
            columns: ["condition_id"];
            isOneToOne: false;
            referencedRelation: "conditions";
            referencedColumns: ["id"];
          },
        ];
      };
      recommendation_categories: {
        Row: {
          code: string;
          created_at: string | null;
          icon: string;
          id: string;
          name_en: string;
          name_es: string;
          order_index: number;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          icon?: string;
          id?: string;
          name_en: string;
          name_es: string;
          order_index?: number;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          icon?: string;
          id?: string;
          name_en?: string;
          name_es?: string;
          order_index?: number;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          age_max_months: number | null;
          age_min_months: number | null;
          category_id: string;
          condition_id: string;
          created_at: string | null;
          description_en: string;
          description_es: string;
          id: string;
          priority: number;
          risk_levels: string[];
          title_en: string;
          title_es: string;
        };
        Insert: {
          age_max_months?: number | null;
          age_min_months?: number | null;
          category_id: string;
          condition_id: string;
          created_at?: string | null;
          description_en: string;
          description_es: string;
          id?: string;
          priority?: number;
          risk_levels?: string[];
          title_en: string;
          title_es: string;
        };
        Update: {
          age_max_months?: number | null;
          age_min_months?: number | null;
          category_id?: string;
          condition_id?: string;
          created_at?: string | null;
          description_en?: string;
          description_es?: string;
          id?: string;
          priority?: number;
          risk_levels?: string[];
          title_en?: string;
          title_es?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recommendations_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "recommendation_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendations_condition_id_fkey";
            columns: ["condition_id"];
            isOneToOne: false;
            referencedRelation: "conditions";
            referencedColumns: ["id"];
          },
        ];
      };
      reminders: {
        Row: {
          child_name: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          last_sent_at: string | null;
          metadata: Json | null;
          recurrence_days: number[] | null;
          recurrence_pattern: string | null;
          reminder_date: string;
          reminder_time: string;
          reminder_type: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          child_name?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_sent_at?: string | null;
          metadata?: Json | null;
          recurrence_days?: number[] | null;
          recurrence_pattern?: string | null;
          reminder_date: string;
          reminder_time: string;
          reminder_type: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          child_name?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_sent_at?: string | null;
          metadata?: Json | null;
          recurrence_days?: number[] | null;
          recurrence_pattern?: string | null;
          reminder_date?: string;
          reminder_time?: string;
          reminder_type?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      report_sections_config: {
        Row: {
          created_at: string | null;
          data_sources: Json | null;
          display_settings: Json | null;
          id: string;
          is_required: boolean | null;
          section_name: string;
          section_order: number | null;
          template_id: string;
        };
        Insert: {
          created_at?: string | null;
          data_sources?: Json | null;
          display_settings?: Json | null;
          id?: string;
          is_required?: boolean | null;
          section_name: string;
          section_order?: number | null;
          template_id: string;
        };
        Update: {
          created_at?: string | null;
          data_sources?: Json | null;
          display_settings?: Json | null;
          id?: string;
          is_required?: boolean | null;
          section_name?: string;
          section_order?: number | null;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_sections_config_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "report_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      report_templates: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          sections: Json | null;
          template_type: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          sections?: Json | null;
          template_type: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          sections?: Json | null;
          template_type?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          report_data: NonNullable<Json>;
          session_id: string | null;
          shared_with: string[] | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          report_data?: NonNullable<Json>;
          session_id?: string | null;
          shared_with?: string[] | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          report_data?: NonNullable<Json>;
          session_id?: string | null;
          shared_with?: string[] | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reports_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "screening_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      resource_reviews: {
        Row: {
          created_at: string | null;
          helpful_count: number | null;
          id: string;
          rating: number;
          resource_id: string;
          review_text: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          helpful_count?: number | null;
          id?: string;
          rating: number;
          resource_id: string;
          review_text?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          helpful_count?: number | null;
          id?: string;
          rating?: number;
          resource_id?: string;
          review_text?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "resource_reviews_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "community_shared_resources";
            referencedColumns: ["id"];
          },
        ];
      };
      reward_charts: {
        Row: {
          chart_name: string;
          chart_type: string;
          child_name: string;
          created_at: string | null;
          end_date: string | null;
          id: string;
          is_active: boolean | null;
          is_effective: boolean | null;
          points_per_star: number | null;
          start_date: string | null;
          target_behavior: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          chart_name: string;
          chart_type: string;
          child_name: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_effective?: boolean | null;
          points_per_star?: number | null;
          start_date?: string | null;
          target_behavior: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          chart_name?: string;
          chart_type?: string;
          child_name?: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_effective?: boolean | null;
          points_per_star?: number | null;
          start_date?: string | null;
          target_behavior?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      reward_entries: {
        Row: {
          behavior_performed: string | null;
          chart_id: string;
          created_at: string | null;
          entry_date: string;
          entry_time: string | null;
          id: string;
          notes: string | null;
          stars_earned: number;
        };
        Insert: {
          behavior_performed?: string | null;
          chart_id: string;
          created_at?: string | null;
          entry_date?: string;
          entry_time?: string | null;
          id?: string;
          notes?: string | null;
          stars_earned?: number;
        };
        Update: {
          behavior_performed?: string | null;
          chart_id?: string;
          created_at?: string | null;
          entry_date?: string;
          entry_time?: string | null;
          id?: string;
          notes?: string | null;
          stars_earned?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reward_entries_chart_id_fkey";
            columns: ["chart_id"];
            isOneToOne: false;
            referencedRelation: "reward_charts";
            referencedColumns: ["id"];
          },
        ];
      };
      reward_goals: {
        Row: {
          achieved_date: string | null;
          chart_id: string;
          created_at: string | null;
          goal_description: string | null;
          goal_name: string;
          id: string;
          is_achieved: boolean | null;
          reward_item: string | null;
          stars_required: number;
        };
        Insert: {
          achieved_date?: string | null;
          chart_id: string;
          created_at?: string | null;
          goal_description?: string | null;
          goal_name: string;
          id?: string;
          is_achieved?: boolean | null;
          reward_item?: string | null;
          stars_required: number;
        };
        Update: {
          achieved_date?: string | null;
          chart_id?: string;
          created_at?: string | null;
          goal_description?: string | null;
          goal_name?: string;
          id?: string;
          is_achieved?: boolean | null;
          reward_item?: string | null;
          stars_required?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reward_goals_chart_id_fkey";
            columns: ["chart_id"];
            isOneToOne: false;
            referencedRelation: "reward_charts";
            referencedColumns: ["id"];
          },
        ];
      };
      routine_steps: {
        Row: {
          completion_required: boolean | null;
          created_at: string | null;
          duration_minutes: number | null;
          icon_name: string | null;
          id: string;
          image_url: string | null;
          routine_id: string;
          step_description: string | null;
          step_number: number;
          step_title: string;
        };
        Insert: {
          completion_required?: boolean | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          icon_name?: string | null;
          id?: string;
          image_url?: string | null;
          routine_id: string;
          step_description?: string | null;
          step_number: number;
          step_title: string;
        };
        Update: {
          completion_required?: boolean | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          icon_name?: string | null;
          id?: string;
          image_url?: string | null;
          routine_id?: string;
          step_description?: string | null;
          step_number?: number;
          step_title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "routine_steps_routine_id_fkey";
            columns: ["routine_id"];
            isOneToOne: false;
            referencedRelation: "daily_routines";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule_activities: {
        Row: {
          activity_description: string | null;
          activity_name: string;
          activity_order: number;
          completion_notes: string | null;
          created_at: string | null;
          duration_minutes: number | null;
          icon_color: string | null;
          icon_name: string | null;
          id: string;
          image_url: string | null;
          is_completed: boolean | null;
          reminder_before_minutes: number | null;
          schedule_id: string;
          start_time: string | null;
        };
        Insert: {
          activity_description?: string | null;
          activity_name: string;
          activity_order: number;
          completion_notes?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          icon_color?: string | null;
          icon_name?: string | null;
          id?: string;
          image_url?: string | null;
          is_completed?: boolean | null;
          reminder_before_minutes?: number | null;
          schedule_id: string;
          start_time?: string | null;
        };
        Update: {
          activity_description?: string | null;
          activity_name?: string;
          activity_order?: number;
          completion_notes?: string | null;
          created_at?: string | null;
          duration_minutes?: number | null;
          icon_color?: string | null;
          icon_name?: string | null;
          id?: string;
          image_url?: string | null;
          is_completed?: boolean | null;
          reminder_before_minutes?: number | null;
          schedule_id?: string;
          start_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_activities_schedule_id_fkey";
            columns: ["schedule_id"];
            isOneToOne: false;
            referencedRelation: "visual_schedules";
            referencedColumns: ["id"];
          },
        ];
      };
      screening_recommendation_rules: {
        Row: {
          condition_id: string;
          condition_name: string;
          created_at: string | null;
          educational_summary: string;
          id: string;
          next_steps: string;
          primary_domains: string[];
          professional_types: string[] | null;
          recommendation_message: string;
          recommendation_message_es: string | null;
          secondary_domains: string[] | null;
          threshold_rules: NonNullable<Json>;
        };
        Insert: {
          condition_id: string;
          condition_name: string;
          created_at?: string | null;
          educational_summary: string;
          id?: string;
          next_steps: string;
          primary_domains: string[];
          professional_types?: string[] | null;
          recommendation_message: string;
          recommendation_message_es?: string | null;
          secondary_domains?: string[] | null;
          threshold_rules: NonNullable<Json>;
        };
        Update: {
          condition_id?: string;
          condition_name?: string;
          created_at?: string | null;
          educational_summary?: string;
          id?: string;
          next_steps?: string;
          primary_domains?: string[];
          professional_types?: string[] | null;
          recommendation_message?: string;
          recommendation_message_es?: string | null;
          secondary_domains?: string[] | null;
          threshold_rules?: NonNullable<Json>;
        };
        Relationships: [];
      };
      screening_results: {
        Row: {
          child_age_months: number;
          child_name: string | null;
          completed_at: string | null;
          condition_id: string;
          created_at: string | null;
          domain_scores: NonNullable<Json>;
          has_red_flags: boolean;
          id: string;
          language: string;
          max_score: number | null;
          responses: NonNullable<Json>;
          risk_level: string;
          total_score: number;
          user_id: string;
        };
        Insert: {
          child_age_months: number;
          child_name?: string | null;
          completed_at?: string | null;
          condition_id: string;
          created_at?: string | null;
          domain_scores?: NonNullable<Json>;
          has_red_flags?: boolean;
          id?: string;
          language?: string;
          max_score?: number | null;
          responses?: NonNullable<Json>;
          risk_level: string;
          total_score?: number;
          user_id: string;
        };
        Update: {
          child_age_months?: number;
          child_name?: string | null;
          completed_at?: string | null;
          condition_id?: string;
          created_at?: string | null;
          domain_scores?: NonNullable<Json>;
          has_red_flags?: boolean;
          id?: string;
          language?: string;
          max_score?: number | null;
          responses?: NonNullable<Json>;
          risk_level?: string;
          total_score?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "screening_results_condition_id_fkey";
            columns: ["condition_id"];
            isOneToOne: false;
            referencedRelation: "conditions";
            referencedColumns: ["id"];
          },
        ];
      };
      screening_sessions: {
        Row: {
          child_age: number;
          child_name: string;
          condition_type: string;
          created_at: string | null;
          id: string;
          notes: string | null;
          recommendations: NonNullable<Json>;
          scores: NonNullable<Json>;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          child_age: number;
          child_name: string;
          condition_type: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          recommendations?: NonNullable<Json>;
          scores?: NonNullable<Json>;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          child_age?: number;
          child_name?: string;
          condition_type?: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          recommendations?: NonNullable<Json>;
          scores?: NonNullable<Json>;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      sensory_observations: {
        Row: {
          created_at: string | null;
          duration_minutes: number | null;
          id: string;
          intensity: number;
          location: string | null;
          observation_date: string;
          observation_time: string;
          other_factors: string[] | null;
          profile_id: string;
          reaction_description: string;
          sensory_system: string;
          time_of_day: string | null;
          trigger_description: string;
          user_id: string;
          what_helped: string | null;
        };
        Insert: {
          created_at?: string | null;
          duration_minutes?: number | null;
          id?: string;
          intensity: number;
          location?: string | null;
          observation_date?: string;
          observation_time?: string;
          other_factors?: string[] | null;
          profile_id: string;
          reaction_description: string;
          sensory_system: string;
          time_of_day?: string | null;
          trigger_description: string;
          user_id: string;
          what_helped?: string | null;
        };
        Update: {
          created_at?: string | null;
          duration_minutes?: number | null;
          id?: string;
          intensity?: number;
          location?: string | null;
          observation_date?: string;
          observation_time?: string;
          other_factors?: string[] | null;
          profile_id?: string;
          reaction_description?: string;
          sensory_system?: string;
          time_of_day?: string | null;
          trigger_description?: string;
          user_id?: string;
          what_helped?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sensory_observations_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "sensory_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sensory_profiles: {
        Row: {
          auditory_avoiding_behaviors: string[] | null;
          auditory_notes: string | null;
          auditory_seeking_behaviors: string[] | null;
          auditory_sensitivity: string | null;
          child_name: string;
          created_at: string | null;
          id: string;
          proprioceptive_avoiding_behaviors: string[] | null;
          proprioceptive_notes: string | null;
          proprioceptive_seeking_behaviors: string[] | null;
          proprioceptive_sensitivity: string | null;
          smell_avoiding_behaviors: string[] | null;
          smell_notes: string | null;
          smell_seeking_behaviors: string[] | null;
          smell_sensitivity: string | null;
          tactile_avoiding_behaviors: string[] | null;
          tactile_notes: string | null;
          tactile_seeking_behaviors: string[] | null;
          tactile_sensitivity: string | null;
          taste_avoiding_behaviors: string[] | null;
          taste_notes: string | null;
          taste_seeking_behaviors: string[] | null;
          taste_sensitivity: string | null;
          updated_at: string | null;
          user_id: string;
          vestibular_avoiding_behaviors: string[] | null;
          vestibular_notes: string | null;
          vestibular_seeking_behaviors: string[] | null;
          vestibular_sensitivity: string | null;
          visual_avoiding_behaviors: string[] | null;
          visual_notes: string | null;
          visual_seeking_behaviors: string[] | null;
          visual_sensitivity: string | null;
        };
        Insert: {
          auditory_avoiding_behaviors?: string[] | null;
          auditory_notes?: string | null;
          auditory_seeking_behaviors?: string[] | null;
          auditory_sensitivity?: string | null;
          child_name: string;
          created_at?: string | null;
          id?: string;
          proprioceptive_avoiding_behaviors?: string[] | null;
          proprioceptive_notes?: string | null;
          proprioceptive_seeking_behaviors?: string[] | null;
          proprioceptive_sensitivity?: string | null;
          smell_avoiding_behaviors?: string[] | null;
          smell_notes?: string | null;
          smell_seeking_behaviors?: string[] | null;
          smell_sensitivity?: string | null;
          tactile_avoiding_behaviors?: string[] | null;
          tactile_notes?: string | null;
          tactile_seeking_behaviors?: string[] | null;
          tactile_sensitivity?: string | null;
          taste_avoiding_behaviors?: string[] | null;
          taste_notes?: string | null;
          taste_seeking_behaviors?: string[] | null;
          taste_sensitivity?: string | null;
          updated_at?: string | null;
          user_id: string;
          vestibular_avoiding_behaviors?: string[] | null;
          vestibular_notes?: string | null;
          vestibular_seeking_behaviors?: string[] | null;
          vestibular_sensitivity?: string | null;
          visual_avoiding_behaviors?: string[] | null;
          visual_notes?: string | null;
          visual_seeking_behaviors?: string[] | null;
          visual_sensitivity?: string | null;
        };
        Update: {
          auditory_avoiding_behaviors?: string[] | null;
          auditory_notes?: string | null;
          auditory_seeking_behaviors?: string[] | null;
          auditory_sensitivity?: string | null;
          child_name?: string;
          created_at?: string | null;
          id?: string;
          proprioceptive_avoiding_behaviors?: string[] | null;
          proprioceptive_notes?: string | null;
          proprioceptive_seeking_behaviors?: string[] | null;
          proprioceptive_sensitivity?: string | null;
          smell_avoiding_behaviors?: string[] | null;
          smell_notes?: string | null;
          smell_seeking_behaviors?: string[] | null;
          smell_sensitivity?: string | null;
          tactile_avoiding_behaviors?: string[] | null;
          tactile_notes?: string | null;
          tactile_seeking_behaviors?: string[] | null;
          tactile_sensitivity?: string | null;
          taste_avoiding_behaviors?: string[] | null;
          taste_notes?: string | null;
          taste_seeking_behaviors?: string[] | null;
          taste_sensitivity?: string | null;
          updated_at?: string | null;
          user_id?: string;
          vestibular_avoiding_behaviors?: string[] | null;
          vestibular_notes?: string | null;
          vestibular_seeking_behaviors?: string[] | null;
          vestibular_sensitivity?: string | null;
          visual_avoiding_behaviors?: string[] | null;
          visual_notes?: string | null;
          visual_seeking_behaviors?: string[] | null;
          visual_sensitivity?: string | null;
        };
        Relationships: [];
      };
      sensory_strategies: {
        Row: {
          created_at: string | null;
          effectiveness_rating: number | null;
          id: string;
          materials_needed: string[] | null;
          notes: string | null;
          profile_id: string;
          sensory_system: string;
          strategy_description: string;
          strategy_name: string;
          updated_at: string | null;
          user_id: string;
          when_to_use: string | null;
        };
        Insert: {
          created_at?: string | null;
          effectiveness_rating?: number | null;
          id?: string;
          materials_needed?: string[] | null;
          notes?: string | null;
          profile_id: string;
          sensory_system: string;
          strategy_description: string;
          strategy_name: string;
          updated_at?: string | null;
          user_id: string;
          when_to_use?: string | null;
        };
        Update: {
          created_at?: string | null;
          effectiveness_rating?: number | null;
          id?: string;
          materials_needed?: string[] | null;
          notes?: string | null;
          profile_id?: string;
          sensory_system?: string;
          strategy_description?: string;
          strategy_name?: string;
          updated_at?: string | null;
          user_id?: string;
          when_to_use?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sensory_strategies_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "sensory_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      therapist_availability: {
        Row: {
          created_at: string | null;
          day_of_week: number;
          end_time: string;
          id: string;
          is_available: boolean | null;
          start_time: string;
          therapist_id: string;
        };
        Insert: {
          created_at?: string | null;
          day_of_week: number;
          end_time: string;
          id?: string;
          is_available?: boolean | null;
          start_time: string;
          therapist_id: string;
        };
        Update: {
          created_at?: string | null;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          is_available?: boolean | null;
          start_time?: string;
          therapist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "therapist_availability_therapist_id_fkey";
            columns: ["therapist_id"];
            isOneToOne: false;
            referencedRelation: "therapist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      therapist_insurance: {
        Row: {
          created_at: string | null;
          id: string;
          insurance_provider_id: string;
          therapist_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          insurance_provider_id: string;
          therapist_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          insurance_provider_id?: string;
          therapist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "therapist_insurance_insurance_provider_id_fkey";
            columns: ["insurance_provider_id"];
            isOneToOne: false;
            referencedRelation: "insurance_providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "therapist_insurance_therapist_id_fkey";
            columns: ["therapist_id"];
            isOneToOne: false;
            referencedRelation: "therapist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      therapist_profiles: {
        Row: {
          accepts_new_clients: boolean | null;
          age_groups_served: string[] | null;
          average_rating: number | null;
          biography: string | null;
          city: string;
          created_at: string | null;
          credentials: string;
          email: string | null;
          full_name: string;
          id: string;
          is_verified: boolean | null;
          languages_spoken: string[] | null;
          latitude: number | null;
          longitude: number | null;
          offers_telehealth: boolean | null;
          office_address: string | null;
          phone_number: string | null;
          profile_image_url: string | null;
          specialties: string[] | null;
          state: string;
          therapy_type: string;
          total_reviews: number | null;
          updated_at: string | null;
          website_url: string | null;
          years_experience: number;
          zip_code: string | null;
        };
        Insert: {
          accepts_new_clients?: boolean | null;
          age_groups_served?: string[] | null;
          average_rating?: number | null;
          biography?: string | null;
          city: string;
          created_at?: string | null;
          credentials: string;
          email?: string | null;
          full_name: string;
          id?: string;
          is_verified?: boolean | null;
          languages_spoken?: string[] | null;
          latitude?: number | null;
          longitude?: number | null;
          offers_telehealth?: boolean | null;
          office_address?: string | null;
          phone_number?: string | null;
          profile_image_url?: string | null;
          specialties?: string[] | null;
          state: string;
          therapy_type: string;
          total_reviews?: number | null;
          updated_at?: string | null;
          website_url?: string | null;
          years_experience: number;
          zip_code?: string | null;
        };
        Update: {
          accepts_new_clients?: boolean | null;
          age_groups_served?: string[] | null;
          average_rating?: number | null;
          biography?: string | null;
          city?: string;
          created_at?: string | null;
          credentials?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_verified?: boolean | null;
          languages_spoken?: string[] | null;
          latitude?: number | null;
          longitude?: number | null;
          offers_telehealth?: boolean | null;
          office_address?: string | null;
          phone_number?: string | null;
          profile_image_url?: string | null;
          specialties?: string[] | null;
          state?: string;
          therapy_type?: string;
          total_reviews?: number | null;
          updated_at?: string | null;
          website_url?: string | null;
          years_experience?: number;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      therapist_reviews: {
        Row: {
          created_at: string | null;
          helpful_count: number | null;
          id: string;
          is_verified_patient: boolean | null;
          rating: number;
          review_text: string | null;
          review_title: string | null;
          therapist_id: string;
          updated_at: string | null;
          user_id: string;
          would_recommend: boolean | null;
        };
        Insert: {
          created_at?: string | null;
          helpful_count?: number | null;
          id?: string;
          is_verified_patient?: boolean | null;
          rating: number;
          review_text?: string | null;
          review_title?: string | null;
          therapist_id: string;
          updated_at?: string | null;
          user_id: string;
          would_recommend?: boolean | null;
        };
        Update: {
          created_at?: string | null;
          helpful_count?: number | null;
          id?: string;
          is_verified_patient?: boolean | null;
          rating?: number;
          review_text?: string | null;
          review_title?: string | null;
          therapist_id?: string;
          updated_at?: string | null;
          user_id?: string;
          would_recommend?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "therapist_reviews_therapist_id_fkey";
            columns: ["therapist_id"];
            isOneToOne: false;
            referencedRelation: "therapist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      therapist_specializations: {
        Row: {
          condition_name: string;
          created_at: string | null;
          id: string;
          therapist_id: string;
        };
        Insert: {
          condition_name: string;
          created_at?: string | null;
          id?: string;
          therapist_id: string;
        };
        Update: {
          condition_name?: string;
          created_at?: string | null;
          id?: string;
          therapist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "therapist_specializations_therapist_id_fkey";
            columns: ["therapist_id"];
            isOneToOne: false;
            referencedRelation: "therapist_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      therapy_resources: {
        Row: {
          accepts_insurance: boolean | null;
          address: string | null;
          age_groups: string[] | null;
          city: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          country: string | null;
          created_at: string | null;
          description: string;
          id: string;
          insurance_types: string[] | null;
          languages: string[] | null;
          name: string;
          rating: number | null;
          resource_type: string;
          services_offered: string[] | null;
          specialties: string[];
          state: string | null;
          teletherapy_available: boolean | null;
          updated_at: string | null;
          website: string | null;
          zip_code: string | null;
        };
        Insert: {
          accepts_insurance?: boolean | null;
          address?: string | null;
          age_groups?: string[] | null;
          city?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          country?: string | null;
          created_at?: string | null;
          description: string;
          id?: string;
          insurance_types?: string[] | null;
          languages?: string[] | null;
          name: string;
          rating?: number | null;
          resource_type: string;
          services_offered?: string[] | null;
          specialties?: string[];
          state?: string | null;
          teletherapy_available?: boolean | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Update: {
          accepts_insurance?: boolean | null;
          address?: string | null;
          age_groups?: string[] | null;
          city?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          country?: string | null;
          created_at?: string | null;
          description?: string;
          id?: string;
          insurance_types?: string[] | null;
          languages?: string[] | null;
          name?: string;
          rating?: number | null;
          resource_type?: string;
          services_offered?: string[] | null;
          specialties?: string[];
          state?: string | null;
          teletherapy_available?: boolean | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      typical_milestones: {
        Row: {
          age_range_end_months: number;
          age_range_start_months: number;
          category_id: string;
          created_at: string | null;
          id: string;
          importance_level: string;
          milestone_description: string;
          milestone_name: string;
          tips_for_encouraging: string[] | null;
          warning_signs: string[] | null;
        };
        Insert: {
          age_range_end_months: number;
          age_range_start_months: number;
          category_id: string;
          created_at?: string | null;
          id?: string;
          importance_level: string;
          milestone_description: string;
          milestone_name: string;
          tips_for_encouraging?: string[] | null;
          warning_signs?: string[] | null;
        };
        Update: {
          age_range_end_months?: number;
          age_range_start_months?: number;
          category_id?: string;
          created_at?: string | null;
          id?: string;
          importance_level?: string;
          milestone_description?: string;
          milestone_name?: string;
          tips_for_encouraging?: string[] | null;
          warning_signs?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "typical_milestones_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "milestone_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      user_earned_badges: {
        Row: {
          badge_id: string;
          displayed_on_profile: boolean | null;
          earned_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          displayed_on_profile?: boolean | null;
          earned_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          displayed_on_profile?: boolean | null;
          earned_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_earned_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "parent_skill_badges";
            referencedColumns: ["id"];
          },
        ];
      };
      user_pathway_progress: {
        Row: {
          completed_at: string | null;
          completed_modules: string[] | null;
          completion_percentage: number | null;
          current_module: string | null;
          id: string;
          pathway_id: string;
          started_at: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          completed_modules?: string[] | null;
          completion_percentage?: number | null;
          current_module?: string | null;
          id?: string;
          pathway_id: string;
          started_at?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          completed_modules?: string[] | null;
          completion_percentage?: number | null;
          current_module?: string | null;
          id?: string;
          pathway_id?: string;
          started_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_pathway_progress_pathway_id_fkey";
            columns: ["pathway_id"];
            isOneToOne: false;
            referencedRelation: "learning_pathways";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          bio: string | null;
          child_conditions: string[] | null;
          comments_count: number | null;
          created_at: string | null;
          display_name: string;
          id: string;
          joined_at: string | null;
          posts_count: number | null;
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          child_conditions?: string[] | null;
          comments_count?: number | null;
          created_at?: string | null;
          display_name: string;
          id?: string;
          joined_at?: string | null;
          posts_count?: number | null;
          user_id: string;
        };
        Update: {
          bio?: string | null;
          child_conditions?: string[] | null;
          comments_count?: number | null;
          created_at?: string | null;
          display_name?: string;
          id?: string;
          joined_at?: string | null;
          posts_count?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_saved_resources: {
        Row: {
          contacted: boolean | null;
          contacted_date: string | null;
          created_at: string | null;
          id: string;
          notes: string | null;
          resource_id: string;
          user_id: string;
        };
        Insert: {
          contacted?: boolean | null;
          contacted_date?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          resource_id: string;
          user_id: string;
        };
        Update: {
          contacted?: boolean | null;
          contacted_date?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          resource_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_saved_resources_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "therapy_resources";
            referencedColumns: ["id"];
          },
        ];
      };
      user_video_progress: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          id: string;
          progress_seconds: number | null;
          updated_at: string | null;
          user_id: string;
          video_id: string | null;
          watched: boolean | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          progress_seconds?: number | null;
          updated_at?: string | null;
          user_id: string;
          video_id?: string | null;
          watched?: boolean | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          progress_seconds?: number | null;
          updated_at?: string | null;
          user_id?: string;
          video_id?: string | null;
          watched?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_video_progress_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      victory_journal: {
        Row: {
          child_profile_id: string | null;
          created_at: string | null;
          date: string;
          description: string | null;
          grateful_for: string[] | null;
          id: string;
          photo_urls: string[] | null;
          title: string;
          user_id: string;
          victory_type: string | null;
        };
        Insert: {
          child_profile_id?: string | null;
          created_at?: string | null;
          date?: string;
          description?: string | null;
          grateful_for?: string[] | null;
          id?: string;
          photo_urls?: string[] | null;
          title: string;
          user_id: string;
          victory_type?: string | null;
        };
        Update: {
          child_profile_id?: string | null;
          created_at?: string | null;
          date?: string;
          description?: string | null;
          grateful_for?: string[] | null;
          id?: string;
          photo_urls?: string[] | null;
          title?: string;
          user_id?: string;
          victory_type?: string | null;
        };
        Relationships: [];
      };
      video_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      video_tags: {
        Row: {
          created_at: string | null;
          id: string;
          tag: string;
          video_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          tag: string;
          video_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          tag?: string;
          video_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "video_tags_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      videos: {
        Row: {
          age_group: string | null;
          category_id: string | null;
          condition_type: string;
          created_at: string | null;
          description: string | null;
          difficulty_level: string | null;
          duration: number | null;
          id: string;
          thumbnail_url: string | null;
          title: string;
          video_url: string;
          views: number | null;
        };
        Insert: {
          age_group?: string | null;
          category_id?: string | null;
          condition_type: string;
          created_at?: string | null;
          description?: string | null;
          difficulty_level?: string | null;
          duration?: number | null;
          id?: string;
          thumbnail_url?: string | null;
          title: string;
          video_url: string;
          views?: number | null;
        };
        Update: {
          age_group?: string | null;
          category_id?: string | null;
          condition_type?: string;
          created_at?: string | null;
          description?: string | null;
          difficulty_level?: string | null;
          duration?: number | null;
          id?: string;
          thumbnail_url?: string | null;
          title?: string;
          video_url?: string;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "videos_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "video_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      visual_schedules: {
        Row: {
          child_name: string;
          created_at: string | null;
          end_date: string | null;
          id: string;
          is_active: boolean | null;
          notes: string | null;
          schedule_name: string;
          schedule_type: string;
          start_date: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          child_name: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          schedule_name: string;
          schedule_type: string;
          start_date?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          child_name?: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          is_active?: boolean | null;
          notes?: string | null;
          schedule_name?: string;
          schedule_type?: string;
          start_date?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      visual_timers: {
        Row: {
          child_name: string;
          color_code: string | null;
          completed_at: string | null;
          created_at: string | null;
          end_time: string;
          id: string;
          is_active: boolean | null;
          start_time: string;
          timer_name: string;
          timer_type: string;
          total_duration_minutes: number;
          user_id: string;
          visual_style: string | null;
        };
        Insert: {
          child_name: string;
          color_code?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          end_time: string;
          id?: string;
          is_active?: boolean | null;
          start_time: string;
          timer_name: string;
          timer_type: string;
          total_duration_minutes: number;
          user_id: string;
          visual_style?: string | null;
        };
        Update: {
          child_name?: string;
          color_code?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          end_time?: string;
          id?: string;
          is_active?: boolean | null;
          start_time?: string;
          timer_name?: string;
          timer_type?: string;
          total_duration_minutes?: number;
          user_id?: string;
          visual_style?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_video_views: { Args: { p_video_id: string }; Returns: undefined };
      is_group_member: { Args: { gid: string }; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
