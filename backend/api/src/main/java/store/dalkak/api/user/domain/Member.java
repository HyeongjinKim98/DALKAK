package store.dalkak.api.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import store.dalkak.api.user.domain.embed.Gender;
import store.dalkak.api.user.domain.embed.Provider;

@Entity
@Table(name = "MEMBER")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "birth_date")
    private LocalDate birthdate;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "oauth_sub")
    private String oauthSub;

    @Column(name = "oauth_provider")
    @Enumerated(EnumType.STRING)
    private Provider oauthProvider;

    @Column(name = "survey_completion")
    private Boolean surveyCompletion;

    @Builder
    public Member(String nickname, LocalDate birthdate, Gender gender, String oauthSub,
        Provider oauthProvider, Boolean surveyCompletion) {
        this.nickname = nickname;
        this.birthdate = birthdate;
        this.gender = gender;
        this.oauthSub = oauthSub;
        this.oauthProvider = oauthProvider;
        this.surveyCompletion = surveyCompletion;
    }

    public void updateMember(String nickname, LocalDate birthdate, Gender gender) {
        if (nickname != null) {
            this.nickname = nickname;
        }
        if (birthdate != null) {
            this.birthdate = birthdate;
        }
        if (gender != null) {
            this.gender = gender;
        }
    }

    public void updateSurveyComp() {
        this.surveyCompletion = true;
    }

    public void deleteMember() {
        this.nickname = "탈퇴한 사용자";
        this.birthdate = null;
        this.gender = null;
        this.oauthSub = "0";
        this.oauthProvider = Provider.NONE;
        this.surveyCompletion = null;
    }
}
