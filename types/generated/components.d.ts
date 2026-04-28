import type { Schema, Struct } from '@strapi/strapi';

export interface AboutDoiNguQuanLy extends Struct.ComponentSchema {
  collectionName: 'components_about_doi_ngu_quan_ly';
  info: {
    displayName: '\u0110\u1ED9i ng\u0169 qu\u1EA3n l\u00FD';
  };
  attributes: {
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::event-participant.event-participant'
    >;
    title: Schema.Attribute.String;
  };
}

export interface AboutInfo extends Struct.ComponentSchema {
  collectionName: 'components_about_infos';
  info: {
    displayName: 'Th\u00F4ng tin';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface AboutLichSuHinhThanh extends Struct.ComponentSchema {
  collectionName: 'components_about_lich_su_hinh_thanhs';
  info: {
    displayName: 'L\u1ECBch s\u1EED h\u00ECnh th\u00E0nh';
  };
  attributes: {
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::share-history.share-history'
    >;
    title: Schema.Attribute.String;
  };
}

export interface AboutRepeatSoChungNhan extends Struct.ComponentSchema {
  collectionName: 'components_about_repeat_so_chung_nhan_s';
  info: {
    displayName: 'Repeat - S\u1ED1 ch\u1EE9ng nh\u1EADn ';
  };
  attributes: {
    code: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface AboutUuDiem extends Struct.ComponentSchema {
  collectionName: 'components_about_uu_diems';
  info: {
    displayName: '\u01AFu \u0111i\u1EC3m';
  };
  attributes: {
    items: Schema.Attribute.Component<'repeatable.advantage', true>;
  };
}

export interface CareerGocChiaSe extends Struct.ComponentSchema {
  collectionName: 'components_career_goc_chia_se';
  info: {
    displayName: 'L\u1EE3i \u00EDch c\u1EE7a ch\u00FAng t\u00F4i';
  };
  attributes: {
    items: Schema.Attribute.Component<'repeatable.info-to-image', true>;
    title: Schema.Attribute.String;
  };
}

export interface CareerImageGalaxy extends Struct.ComponentSchema {
  collectionName: 'components_career_image_galaxies';
  info: {
    displayName: 'Image Galaxy';
  };
  attributes: {
    items: Schema.Attribute.Component<'repeatable.hyperlink-to-image', true>;
    title: Schema.Attribute.String;
  };
}

export interface CareerLamViecTaiNha extends Struct.ComponentSchema {
  collectionName: 'components_career_lam_viec_tai_nha';
  info: {
    displayName: 'L\u00E0m vi\u1EC7c t\u1EA1i nh\u00E0';
  };
  attributes: {
    items: Schema.Attribute.Component<'repeatable.info-to-image-editor', true>;
    title: Schema.Attribute.String;
  };
}

export interface CareerLamViecTaiNhaLinhHoat extends Struct.ComponentSchema {
  collectionName: 'components_career_lam_viec_tai_nha_linh_hoats';
  info: {
    displayName: 'Gi\u1EA3i ph\u00E1p nh\u00E2n s\u1EF1';
  };
  attributes: {
    items: Schema.Attribute.Component<'repeatable.info-to-image-editor', true>;
    title: Schema.Attribute.String;
  };
}

export interface CareerTuyenDungNhuTheNao extends Struct.ComponentSchema {
  collectionName: 'components_career_tuyen_dung_nhu_the_naos';
  info: {
    displayName: 'Tuy\u1EC3n d\u1EE5ng nh\u01B0 th\u1EBF n\u00E0o';
  };
  attributes: {
    items: Schema.Attribute.Component<'repeatable.info-to-image-editor', true>;
    title: Schema.Attribute.String;
  };
}

export interface ContactDiaChi extends Struct.ComponentSchema {
  collectionName: 'components_contact_dia_chi';
  info: {
    displayName: '\u0110\u1ECBa ch\u1EC9';
  };
  attributes: {
    address: Schema.Attribute.String;
    fax: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ContactGiayChungNhan extends Struct.ComponentSchema {
  collectionName: 'components_contact_giay_chung_nhans';
  info: {
    displayName: 'Gi\u1EA5y ch\u1EE9ng nh\u1EADn';
  };
  attributes: {
    certification_items: Schema.Attribute.Component<
      'about.repeat-so-chung-nhan',
      true
    >;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
    title_refix: Schema.Attribute.String;
  };
}

export interface ContactThongTin extends Struct.ComponentSchema {
  collectionName: 'components_contact_thong_tins';
  info: {
    displayName: 'Th\u00F4ng tin';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<'global::tinymce'>;
    title: Schema.Attribute.String;
  };
}

export interface HomepageAbout extends Struct.ComponentSchema {
  collectionName: 'components_homepage_abouts';
  info: {
    displayName: 'Gi\u1EDBi thi\u1EC7u';
  };
  attributes: {
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface HomepageGiaiPhapNhanSu extends Struct.ComponentSchema {
  collectionName: 'components_homepage_giai_phap_nhan_su';
  info: {
    displayName: 'Gi\u1EA3i ph\u00E1p nh\u00E2n s\u1EF1';
  };
  attributes: {
    button_text: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::human-resource.human-resource'
    >;
    title: Schema.Attribute.String;
  };
}

export interface HomepageSuKien extends Struct.ComponentSchema {
  collectionName: 'components_homepage_su_kiens';
  info: {
    displayName: 'S\u1EF1 ki\u1EC7n';
  };
  attributes: {
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    items: Schema.Attribute.Relation<'oneToMany', 'api::event.event'>;
    title: Schema.Attribute.String;
  };
}

export interface HomepageTinTuc extends Struct.ComponentSchema {
  collectionName: 'components_homepage_tin_tucs';
  info: {
    displayName: 'Tin T\u1EE9c';
  };
  attributes: {
    items: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
    title: Schema.Attribute.String;
  };
}

export interface HomepageVideo extends Struct.ComponentSchema {
  collectionName: 'components_homepage_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    description: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface PartialsBannerTop extends Struct.ComponentSchema {
  collectionName: 'components_partials_banner_tops';
  info: {
    displayName: 'BannerTop';
  };
  attributes: {
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface PartialsHeader extends Struct.ComponentSchema {
  collectionName: 'components_partials_headers';
  info: {
    displayName: 'Favicon';
  };
  attributes: {
    favicon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface PartialsLogo extends Struct.ComponentSchema {
  collectionName: 'components_partials_logos';
  info: {
    displayName: 'Logo';
  };
  attributes: {
    company_name: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface PartialsOptions extends Struct.ComponentSchema {
  collectionName: 'components_partials_options';
  info: {
    displayName: 'Options';
  };
  attributes: {
    is_bottom: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    is_footer: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    is_header: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PostBaiVietNoiBat extends Struct.ComponentSchema {
  collectionName: 'components_post_bai_viet_noi_bats';
  info: {
    displayName: 'B\u00E0i vi\u1EBFt n\u1ED5i b\u1EADt';
  };
  attributes: {
    items: Schema.Attribute.Relation<'oneToMany', 'api::post.post'>;
  };
}

export interface RepeatableAchievements extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_achievements';
  info: {
    displayName: 'Achievements';
  };
  attributes: {
    count_text: Schema.Attribute.String;
    count_up: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title_top: Schema.Attribute.String;
  };
}

export interface RepeatableAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_advantages';
  info: {
    displayName: 'Advantage';
  };
  attributes: {
    content: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface RepeatableCustomerFeedback extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_customer_feedbacks';
  info: {
    displayName: 'Customer feedback';
  };
  attributes: {
    author: Schema.Attribute.String;
    avatar: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    comment: Schema.Attribute.Text;
    regency: Schema.Attribute.String;
  };
}

export interface RepeatableHyperlinkToImage extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_hyperlink_to_images';
  info: {
    displayName: 'Hyperlink To Image';
  };
  attributes: {
    link: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface RepeatableInfoToImage extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_info_to_images';
  info: {
    displayName: 'Info to Image';
  };
  attributes: {
    description: Schema.Attribute.Text;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface RepeatableInfoToImageEditor extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_info_to_image_editor_s';
  info: {
    displayName: 'Info to Image Editor ';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<'global::tinymce'>;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface RepeatableVideo extends Struct.ComponentSchema {
  collectionName: 'components_repeatable_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    description: Schema.Attribute.Text;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    video: Schema.Attribute.Media<'files' | 'videos'>;
  };
}

export interface SeoMetadataMetaSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_metadata_meta_seos';
  info: {
    displayName: 'SEO META';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaKeywords: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
  };
}

export interface SharesCamNhanKhachHang extends Struct.ComponentSchema {
  collectionName: 'components_shares_cam_nhan_khach_hangs';
  info: {
    displayName: 'C\u1EA3m nh\u1EADn kh\u00E1ch h\u00E0ng';
  };
  attributes: {
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::feedback-set.feedback-set'
    >;
  };
}

export interface SharesChungChiChungNhan extends Struct.ComponentSchema {
  collectionName: 'components_shares_chung_chi_chung_nhans';
  info: {
    displayName: 'Ch\u1EE9ng ch\u1EC9 - Ch\u1EE9ng nh\u1EADn';
  };
  attributes: {
    item: Schema.Attribute.Relation<
      'oneToOne',
      'api::share-certificate.share-certificate'
    >;
  };
}

export interface SharesDoiTac extends Struct.ComponentSchema {
  collectionName: 'components_shares_doi_tacs';
  info: {
    displayName: '\u0110\u1ED1i t\u00E1c';
  };
  attributes: {
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::partner-set.partner-set'
    >;
  };
}

export interface SharesKhachHang extends Struct.ComponentSchema {
  collectionName: 'components_shares_khach_hangs';
  info: {
    displayName: 'Kh\u00E1ch h\u00E0ng';
  };
  attributes: {
    items: Schema.Attribute.Relation<
      'oneToMany',
      'api::customer-set.customer-set'
    >;
  };
}

export interface SharesThanhTuu extends Struct.ComponentSchema {
  collectionName: 'components_shares_thanh_tuus';
  info: {
    displayName: 'Th\u00E0nh t\u1EF1u';
  };
  attributes: {
    item: Schema.Attribute.Relation<
      'oneToOne',
      'api::achievement-set.achievement-set'
    >;
  };
}

export interface SharesVideo extends Struct.ComponentSchema {
  collectionName: 'components_shares_videos';
  info: {
    displayName: 'Video';
  };
  attributes: {
    items: Schema.Attribute.Relation<'oneToMany', 'api::video-set.video-set'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.doi-ngu-quan-ly': AboutDoiNguQuanLy;
      'about.info': AboutInfo;
      'about.lich-su-hinh-thanh': AboutLichSuHinhThanh;
      'about.repeat-so-chung-nhan': AboutRepeatSoChungNhan;
      'about.uu-diem': AboutUuDiem;
      'career.goc-chia-se': CareerGocChiaSe;
      'career.image-galaxy': CareerImageGalaxy;
      'career.lam-viec-tai-nha': CareerLamViecTaiNha;
      'career.lam-viec-tai-nha-linh-hoat': CareerLamViecTaiNhaLinhHoat;
      'career.tuyen-dung-nhu-the-nao': CareerTuyenDungNhuTheNao;
      'contact.dia-chi': ContactDiaChi;
      'contact.giay-chung-nhan': ContactGiayChungNhan;
      'contact.thong-tin': ContactThongTin;
      'homepage.about': HomepageAbout;
      'homepage.giai-phap-nhan-su': HomepageGiaiPhapNhanSu;
      'homepage.su-kien': HomepageSuKien;
      'homepage.tin-tuc': HomepageTinTuc;
      'homepage.video': HomepageVideo;
      'partials.banner-top': PartialsBannerTop;
      'partials.header': PartialsHeader;
      'partials.logo': PartialsLogo;
      'partials.options': PartialsOptions;
      'post.bai-viet-noi-bat': PostBaiVietNoiBat;
      'repeatable.achievements': RepeatableAchievements;
      'repeatable.advantage': RepeatableAdvantage;
      'repeatable.customer-feedback': RepeatableCustomerFeedback;
      'repeatable.hyperlink-to-image': RepeatableHyperlinkToImage;
      'repeatable.info-to-image': RepeatableInfoToImage;
      'repeatable.info-to-image-editor': RepeatableInfoToImageEditor;
      'repeatable.video': RepeatableVideo;
      'seo-metadata.meta-seo': SeoMetadataMetaSeo;
      'shares.cam-nhan-khach-hang': SharesCamNhanKhachHang;
      'shares.chung-chi-chung-nhan': SharesChungChiChungNhan;
      'shares.doi-tac': SharesDoiTac;
      'shares.khach-hang': SharesKhachHang;
      'shares.thanh-tuu': SharesThanhTuu;
      'shares.video': SharesVideo;
    }
  }
}
