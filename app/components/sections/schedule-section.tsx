import clsx from 'clsx';
import { Grid } from '../grid';
import { Spacer } from '../spacer';
import { HeaderSection } from './header-section';

interface ScheduleSectionProps {
  description: string;
  schedule: any;
  showArrowButton?: boolean;
  title: string;
}

export function ScheduleSection({
  description,
  schedule,
  showArrowButton = true,
  title,
}: ScheduleSectionProps) {
  return (
    <>
      <HeaderSection
        title={title}
        subTitle={description}
        cta={showArrowButton ? 'See the full blog' : undefined}
        ctaUrl="/blog"
      />
      <Spacer size="2xs" />
      <Grid className="gap-y-16">
        {/* {articles.slice(0, 3).map((article, idx) => (
          <div
            key={article.slug}
            className={clsx('col-span-4', {
              'hidden lg:block': idx >= 2,
            })}
          >
            <ArticleCard article={article} />
          </div>
        ))} */}
        <span>Rooster</span>
      </Grid>
    </>
  );
}
