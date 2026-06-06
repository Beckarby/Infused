import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/UseAuthStore';

type FormData = {
  fullName: string;
  email: string;
  password: string;
};

export default function SignInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const { signIn, isLoading, error } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    await signIn(data.fullName, data.email, data.password);
    if (useAuthStore.getState().isAuthenticated) {
      router.replace('/');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.neutral }]}>
        
        <ThemedText
          type="title"
          style={[
            styles.appTitle,
            {
              color: colors.primary,
              fontFamily: Fonts.headline,
            },
          ]}>
            Infused
          </ThemedText>
        
        <ThemedText
          type="title"
          style={[
            styles.header,
            {
              color: colors.primary,
              fontFamily: Fonts.headline,
            },
          ]}>
          Create Account
        </ThemedText>

        <ThemedText
          style={[
            styles.subtitle,
            {
              color: colors.text,
              fontFamily: Fonts.body,
            },
          ]}>
          Fill in your details to get started
        </ThemedText>

        {error ? (
          <ThemedText
            style={[
              styles.apiError,
              {
                color: colors.secondary,
                fontFamily: Fonts.label,
              },
            ]}>
            {error}
          </ThemedText>
        ) : null}

        <View style={styles.inputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.label,
              {
                color: colors.text,
                fontFamily: Fonts.label,
              },
            ]}>
            Full Name
          </ThemedText>

          <Controller
            control={control}
            name="fullName"
            rules={{ required: 'Full name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: errors.fullName ? colors.secondary : colors.tertiary,
                    color: colors.text,
                    fontFamily: Fonts.body,
                  },
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.icon}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {errors.fullName ? (
            <ThemedText
              style={[
                styles.errorText,
                {
                  color: colors.secondary,
                  fontFamily: Fonts.label,
                },
              ]}>
              {errors.fullName.message}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.label,
              {
                color: colors.text,
                fontFamily: Fonts.label,
              },
            ]}>
            Email Address
          </ThemedText>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: errors.email ? colors.secondary : colors.tertiary,
                    color: colors.text,
                    fontFamily: Fonts.body,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {errors.email ? (
            <ThemedText
              style={[
                styles.errorText,
                {
                  color: colors.secondary,
                  fontFamily: Fonts.label,
                },
              ]}>
              {errors.email.message}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.label,
              {
                color: colors.text,
                fontFamily: Fonts.label,
              },
            ]}>
            Password
          </ThemedText>

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: errors.password ? colors.secondary : colors.tertiary,
                    color: colors.text,
                    fontFamily: Fonts.body,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.icon}
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {errors.password ? (
            <ThemedText
              style={[
                styles.errorText,
                {
                  color: colors.secondary,
                  fontFamily: Fonts.label,
                },
              ]}>
              {errors.password.message}
            </ThemedText>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          activeOpacity={0.85}>
          {isLoading ? (
            <ActivityIndicator color={colors.neutral} />
          ) : (
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.buttonText,
                {
                  color: colors.neutral,
                  fontFamily: Fonts.label,
                },
              ]}>
              Sign In
            </ThemedText>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText
            style={[
              styles.footerText,
              {
                color: colors.text,
                fontFamily: Fonts.body,
              },
            ]}>
            Already have an account?
          </ThemedText>

          <Link href="/login" asChild>
            <TouchableOpacity>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.footerLink,
                  {
                    color: colors.primary,
                    fontFamily: Fonts.label,
                  },
                ]}>
                Log In
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  header: {
    fontSize: 32,
    lineHeight: 36,
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 35,
    lineHeight: 150,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 6,
  },
  apiError: {
    textAlign: 'center',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  footer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
  },
});